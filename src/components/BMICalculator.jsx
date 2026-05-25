import { useState } from 'react';

const BMICalculator = ({ onSave }) => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState('');

    const calculateBMI = (e) => {
        e.preventDefault();
        if (height > 0 && weight > 0) {
            const h = height / 100;
            const bmiValue = (weight / (h * h)).toFixed(1);
            setBmi(bmiValue);
            
            let cat = '';
            if (bmiValue < 18.5) cat = 'Underweight';
            else if (bmiValue < 24.9) cat = 'Normal Weight';
            else if (bmiValue < 29.9) cat = 'Overweight';
            else cat = 'Obese';
            
            setCategory(cat);
            
            if (onSave) {
                onSave(bmiValue, cat);
            }
        }
    };

    return (
        <div className="glass-card p-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-electricCyan mb-4 flex items-center gap-2">
                BMI Calculator
            </h2>
            <form onSubmit={calculateBMI} className="space-y-4">
                <div>
                    <label className="block text-sm text-textMuted mb-1">Height (cm)</label>
                    <input 
                        type="number" 
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="input-field"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm text-textMuted mb-1">Weight (kg)</label>
                    <input 
                        type="number" 
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="input-field"
                        required 
                    />
                </div>
                <button type="submit" className="cyan-button w-full">Calculate BMI</button>
            </form>

            {bmi && (
                <div className="mt-6 p-4 rounded-xl bg-surface border border-electricCyan/20 text-center animate-pulse">
                    <p className="text-3xl font-bold text-textMain mb-1">{bmi}</p>
                    <p className={`text-sm font-semibold uppercase tracking-wider ${
                        category === 'Normal Weight' ? 'text-neonGreen' : 'text-yellow-400'
                    }`}>
                        {category}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BMICalculator;
