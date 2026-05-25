import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PlanCard from '../components/PlanCard';
import { useAuth } from '../context/AuthContext';

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookingMsg, setBookingMsg] = useState('');

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await api.get('/plans');
                setPlans(res.data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchPlans();
    }, []);

    const handleSelectPlan = async (planId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            // 1. Create order on the backend
            const orderRes = await api.post('/payments/create-order', { planId });
            
            if (orderRes.data.isFree) {
                setBookingMsg('Free plan activated successfully!');
                setTimeout(() => navigate('/dashboard'), 2000);
                return;
            }

            const { orderId, amount, currency, key } = orderRes.data;

            // 2. Initialize Razorpay Checkout
            const options = {
                key: key,
                amount: amount,
                currency: currency,
                name: 'FitGuardian',
                description: 'Subscription Plan Checkout',
                order_id: orderId,
                handler: async function (response) {
                    try {
                        // 3. Verify payment on the backend
                        const verifyRes = await api.post('/payments/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: planId
                        });

                        if (verifyRes.data.success) {
                            setBookingMsg('Subscription successful! You are now a premium member.');
                            setTimeout(() => navigate('/dashboard'), 2000);
                        }
                    } catch (err) {
                        console.error('Payment verification failed:', err);
                        setBookingMsg('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#39ff14' // neonGreen
                }
            };

            const rzp = new window.Razorpay(options);
            
            rzp.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                setBookingMsg('Payment failed. Please try again.');
            });

            rzp.open();

        } catch (error) {
            console.error('Error initiating payment:', error);
            setBookingMsg('Error initiating payment. Please try again later.');
        }
    };

    if (loading) return <div className="text-center mt-20 text-neonGreen">Loading plans...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-textMain mb-4">Choose Your Plan</h1>
                <p className="text-textMuted max-w-2xl mx-auto">Upgrade to premium and unlock our cutting-edge AI Posture Analyzer and personalized workout generators.</p>
            </div>

            {bookingMsg && (
                <div className="bg-neonGreen/20 text-neonGreen p-4 rounded-xl text-center border border-neonGreen/50 font-bold">
                    {bookingMsg}
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map(plan => (
                    <PlanCard key={plan._id} plan={plan} onSelect={handleSelectPlan} />
                ))}
            </div>

            {plans.length === 0 && (
                <div className="text-center text-gray-500">No plans currently available. Check back soon.</div>
            )}
        </div>
    );
};

export default Plans;
