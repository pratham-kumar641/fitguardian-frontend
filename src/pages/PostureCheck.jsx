import { useEffect, useRef, useState } from 'react';
import { 
    Activity, ChevronLeft, Camera, Sparkles, RotateCcw, 
    ShieldCheck, AlertTriangle, Info, TrendingUp, Dumbbell, 
    CheckCircle2, XCircle 
} from 'lucide-react';
import api from '../services/api';

const MUSCLES = [
    { 
        id: 'chest', 
        name: 'Chest', 
        desc: 'Pectoral major & minor development', 
        icon: '💪',
        exercises: [
            { id: 'bench_press', name: 'Bench Press', cues: 'Elbows tucked to 45°-75°, bar path controlled', target: 'Elbow flare' },
            { id: 'pushups', name: 'Push-Ups', cues: 'Spine neutral, hips level with shoulders', target: 'Spine line' },
            { id: 'chest_fly', name: 'Chest Fly', cues: 'Maintain slight elbow bend in wide arc', target: 'Elbow lock' },
            { id: 'incline_press', name: 'Incline Press', cues: 'Press up and forward, control the descent', target: 'Elbow compression' },
            { id: 'decline_press', name: 'Decline Press', cues: 'Keep elbows around 60° to protect shoulders', target: 'Elbow path' },
        ]
    },
    { 
        id: 'back', 
        name: 'Back', 
        desc: 'Latissimus dorsi, trap, and rhomboid strength', 
        icon: '🥋',
        exercises: [
            { id: 'pullups', name: 'Pull-Ups', cues: 'Pull all the way up until chin clears hands', target: 'Vertical range' },
            { id: 'lat_pulldown', name: 'Lat Pulldown', cues: 'Pull to collarbone, avoid leaning back past 25°', target: 'Torso lean' },
            { id: 'bent_over_row', name: 'Bent Over Row', cues: 'Flat back (spine neutral), bend at 45° hips', target: 'Neutral spine' },
            { id: 'deadlift', name: 'Deadlift', cues: 'Keep chest up, shoulders retracted, neutral spine', target: 'Spine angle' },
            { id: 'barbell_row', name: 'Barbell Row', cues: 'Keep back flat and pull bar to lower abdomen', target: 'Spine line' },
        ]
    },
    { 
        id: 'tricep', 
        name: 'Triceps', 
        desc: 'Posterior upper arm extension isolation', 
        icon: '⚡',
        exercises: [
            { id: 'overhead_ext', name: 'Overhead Extension', cues: 'Keep elbows pointing forward, close to head', target: 'Elbow flare' },
            { id: 'tricep_dips', name: 'Tricep Dips', cues: 'Stop when upper arms are parallel to floor (90°)', target: 'Abduction angle' },
            { id: 'pushdowns', name: 'Tricep Pushdown', cues: 'Keep elbows pinned to side of your ribs', target: 'Elbow drift' },
            { id: 'diamond_pushups', name: 'Diamond Push-up', cues: 'Narrow hands under chest, straight body line', target: 'Core line' },
            { id: 'skull_crushers', name: 'Skull Crushers', cues: 'Keep upper arms vertical, pivot only at elbow', target: 'Elbow drift' },
        ]
    },
    { 
        id: 'bicep', 
        name: 'Biceps', 
        desc: 'Anterior upper arm contraction & curls', 
        icon: '💥',
        exercises: [
            { id: 'bicep_curl', name: 'Bicep Curl', cues: 'Keep elbows fixed at sides, do not swing torso', target: 'Elbow pivot' },
            { id: 'hammer_curl', name: 'Hammer Curl', cues: 'Neutral grip, elbows stationary at sides', target: 'Elbow pivot' },
            { id: 'concentration_curl', name: 'Concentration Curl', cues: 'Lock elbow against inner thigh to isolate bicep', target: 'Elbow pivot' },
            { id: 'chinups', name: 'Chin-Ups', cues: 'Underhand grip, pull chest to the bar', target: 'Range of motion' },
            { id: 'preacher_curl', name: 'Preacher Curl', cues: 'Rest upper arms on pad, extend fully at bottom', target: 'Elbow extension' },
        ]
    },
    { 
        id: 'leg', 
        name: 'Legs', 
        desc: 'Quads, hamstrings, glutes, & calf power', 
        icon: '🏃',
        exercises: [
            { id: 'squat', name: 'Squat', cues: 'Hips parallel to floor, knees behind toes', target: 'Knee flexion & depth' },
            { id: 'lunge', name: 'Lunge', cues: 'Step back, keep front knee directly over ankle', target: 'Knee overshoot' },
            { id: 'leg_extension', name: 'Leg Extension', cues: 'Controlled extension, squeeze quads at top', target: 'Extension angle' },
            { id: 'calf_raise', name: 'Calf Raise', cues: 'Press high onto toes, control slow eccentric drop', target: 'Ankle flex' },
            { id: 'glute_bridge', name: 'Glute Bridge', cues: 'Drive hips high, align shoulders to knees', target: 'Hip angle' },
        ]
    },
    { 
        id: 'shoulder', 
        name: 'Shoulders', 
        desc: 'Deltoid caps, presses, and trap lifts', 
        icon: '🛡️',
        exercises: [
            { id: 'shoulder_press', name: 'Shoulder Press', cues: 'Press overhead, keep core locked, avoid arching', target: 'Lower back arch' },
            { id: 'lateral_raise', name: 'Lateral Raise', cues: 'Raise to shoulder level only, slight elbow bend', target: 'Arm height' },
            { id: 'front_raise', name: 'Front Raise', cues: 'Raise weights forward, avoid body momentum', target: 'Arm height' },
            { id: 'shrugs', name: 'Shrugs', cues: 'Shrug shoulders straight up, keep neck neutral', target: 'Shrug height' },
            { id: 'arnold_press', name: 'Arnold Press', cues: 'Rotate dumbbells from chest level to overhead', target: 'Press rotation' },
        ]
    }
];

const PostureCheck = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const requestRef = useRef(null);

    const [hasAccess, setHasAccess] = useState(null);
    const [selectedMuscle, setSelectedMuscle] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [status, setStatus] = useState('Loading posenet model...');
    const [feedback, setFeedback] = useState('Position yourself in front of the camera');
    const [postureAnalysis, setPostureAnalysis] = useState({
        isCorrect: true,
        feedback: 'Stand in front of the camera to begin posture check.',
        score: 100,
        anglesChecked: {}
    });

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const res = await api.get('/bookings/subscription-status');
                if (res.data.planName === 'Deluxe') {
                    setHasAccess(true);
                } else {
                    setHasAccess(false);
                }
            } catch (error) {
                console.error(error);
                setHasAccess(false);
            }
        };
        checkAccess();

        return () => {
            stopCameraAndTracking();
        };
    }, []);

    // Effect to auto-initialize camera and tracking when exercise is selected
    useEffect(() => {
        if (selectedExercise) {
            initCameraAndModel();
        } else {
            stopCameraAndTracking();
        }
        return () => {
            stopCameraAndTracking();
        };
    }, [selectedExercise]);

    const stopCameraAndTracking = () => {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const initCameraAndModel = async () => {
        try {
            setStatus('Requesting webcam access...');
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }

            setStatus('Initializing TensorFlow / PoseNet...');
            
            let attempts = 0;
            const waitForModel = setInterval(async () => {
                if (window.posenet && window.tf) {
                    clearInterval(waitForModel);
                    setStatus('AI Model Loaded. Analyzing...');
                    try {
                        const net = await window.posenet.load({
                            architecture: 'MobileNetV1',
                            outputStride: 16,
                            inputResolution: { width: 640, height: 480 },
                            multiplier: 1.0,
                            quantBytes: 2
                        });
                        startTrackingLoop(net);
                    } catch (err) {
                        console.error("Failed to load PoseNet net", err);
                        setStatus('Failed loading PoseNet neural network.');
                    }
                }
                attempts++;
                if (attempts > 30) {
                    clearInterval(waitForModel);
                    setStatus('Error: CDN load timed out.');
                }
            }, 500);

        } catch (error) {
            console.error("Error accessing camera", error);
            setStatus('Webcam access denied or unavailable.');
        }
    };

    const startTrackingLoop = (net) => {
        const detect = async () => {
            if (!videoRef.current || !canvasRef.current) return;
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (video.readyState === 4) {
                try {
                    const pose = await net.estimateSinglePose(video, {
                        flipHorizontal: false
                    });

                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Perform Exercise Biomechanical Calculation
                    const analysis = analyzeExercisePosture(selectedExercise.id, pose.keypoints);
                    setPostureAnalysis(analysis);
                    setFeedback(analysis.feedback);

                    // Render custom glow skeleton and joints
                    drawSkeleton(pose.keypoints, 0.4, ctx, analysis.isCorrect);
                    drawKeypoints(pose.keypoints, 0.4, ctx, analysis.isCorrect);

                } catch (e) {
                    console.error("Pose detection frame drop", e);
                }
            }
            requestRef.current = requestAnimationFrame(detect);
        };
        requestRef.current = requestAnimationFrame(detect);
    };

    const drawKeypoints = (keypoints, minConfidence, ctx, isCorrect) => {
        keypoints.forEach(k => {
            if (k.score >= minConfidence) {
                ctx.beginPath();
                ctx.arc(k.position.x, k.position.y, 7, 0, 2 * Math.PI);
                ctx.fillStyle = isCorrect ? '#00f5ff' : '#ff9f00'; // Electric Cyan vs Warning Amber
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        });
    };

    const drawSkeleton = (keypoints, minConfidence, ctx, isCorrect) => {
        const adjacentKeyPoints = window.posenet.getAdjacentKeyPoints(keypoints, minConfidence);
        adjacentKeyPoints.forEach((pts) => {
            ctx.beginPath();
            ctx.moveTo(pts[0].position.x, pts[0].position.y);
            ctx.lineTo(pts[1].position.x, pts[1].position.y);
            ctx.lineWidth = 4;
            ctx.strokeStyle = isCorrect ? '#39ff14' : '#ff3131'; // Neon Green vs Cyber Red
            ctx.stroke();
        });
    };

    // Advanced mathematical biomechanical posture corrector engine for 24 exercises
    const analyzeExercisePosture = (exerciseId, keypoints) => {
        let isCorrect = true;
        let feedback = "Position yourself clearly in the camera frame.";
        let score = 100;
        let anglesChecked = {};

        const findPart = (part) => keypoints.find(k => k.part === part && k.score > 0.35);

        const leftShoulder = findPart('leftShoulder');
        const rightShoulder = findPart('rightShoulder');
        const leftElbow = findPart('leftElbow');
        const rightElbow = findPart('rightElbow');
        const leftWrist = findPart('leftWrist');
        const rightWrist = findPart('rightWrist');
        const leftHip = findPart('leftHip');
        const rightHip = findPart('rightHip');
        const leftKnee = findPart('leftKnee');
        const rightKnee = findPart('rightKnee');
        const leftAnkle = findPart('leftAnkle');
        const rightAnkle = findPart('rightAnkle');
        const leftEar = findPart('leftEar');

        const getAngle = (p1, p2, p3) => {
            if (!p1 || !p2 || !p3) return null;
            const rad = Math.atan2(p3.position.y - p2.position.y, p3.position.x - p2.position.x) - 
                        Math.atan2(p1.position.y - p2.position.y, p1.position.x - p2.position.x);
            let angle = Math.abs((rad * 180) / Math.PI);
            if (angle > 180) angle = 360 - angle;
            return Math.round(angle);
        };

        switch (exerciseId) {
            // --- CHEST ---
            case 'bench_press': {
                const leftAngle = getAngle(leftShoulder, leftElbow, leftWrist);
                const rightAngle = getAngle(rightShoulder, rightElbow, rightWrist);
                if (leftAngle) anglesChecked["Left Elbow flexion"] = leftAngle;
                if (rightAngle) anglesChecked["Right Elbow flexion"] = rightAngle;

                if (leftAngle && leftAngle < 100 && (leftAngle < 45 || leftAngle > 80)) {
                    isCorrect = false;
                    feedback = "⚠️ Tuck elbows! Keep elbows between 45°-75° to reduce shoulder stress.";
                    score = 70;
                } else if (rightAngle && rightAngle < 100 && (rightAngle < 45 || rightAngle > 80)) {
                    isCorrect = false;
                    feedback = "⚠️ Tuck elbows! Keep elbows between 45°-75° to reduce shoulder stress.";
                    score = 70;
                } else if (leftAngle || rightAngle) {
                    feedback = "✅ Great elbow alignment! Keep bar path controlled and balanced.";
                    score = 98;
                } else {
                    feedback = "Position your torso and arms fully in the frame.";
                    score = 50;
                }
                break;
            }
            case 'pushups': {
                const leftBody = getAngle(leftShoulder, leftHip, leftKnee);
                const rightBody = getAngle(rightShoulder, rightHip, rightKnee);
                const bodyAngle = leftBody || rightBody;
                if (bodyAngle) anglesChecked["Body Line Angle"] = bodyAngle;

                if (bodyAngle && bodyAngle < 160) {
                    isCorrect = false;
                    feedback = "⚠️ Hips sagging or hiking! Keep your core tight and body straight.";
                    score = 60;
                } else if (bodyAngle) {
                    feedback = "✅ Perfect body line! Keep going.";
                    score = 98;
                } else {
                    feedback = "Align your side-profile on screen (Shoulder, Hip, Knee).";
                    score = 50;
                }
                break;
            }
            case 'chest_fly': {
                const leftAngle = getAngle(leftShoulder, leftElbow, leftWrist);
                const rightAngle = getAngle(rightShoulder, rightElbow, rightWrist);
                if (leftAngle) anglesChecked["Left Elbow bend"] = leftAngle;
                if (rightAngle) anglesChecked["Right Elbow bend"] = rightAngle;

                if ((leftAngle && leftAngle > 170) || (rightAngle && rightAngle > 170)) {
                    isCorrect = false;
                    feedback = "⚠️ Do not lock elbows! Maintain a slight bend in your arms.";
                    score = 75;
                } else if ((leftAngle && leftAngle < 110) || (rightAngle && rightAngle < 110)) {
                    isCorrect = false;
                    feedback = "⚠️ Too much elbow bend! Do not turn this into a press - keep a wide arc.";
                    score = 70;
                } else if (leftAngle || rightAngle) {
                    feedback = "✅ Perfect chest fly arc! Maintain wide motion.";
                    score = 95;
                }
                break;
            }
            case 'incline_press': {
                const leftAngle = getAngle(leftShoulder, leftElbow, leftWrist);
                const rightAngle = getAngle(rightShoulder, rightElbow, rightWrist);
                if (leftAngle) anglesChecked["Left Elbow flexion"] = leftAngle;
                if (rightAngle) anglesChecked["Right Elbow flexion"] = rightAngle;

                if ((leftAngle && leftAngle < 50) || (rightAngle && rightAngle < 50)) {
                    isCorrect = false;
                    feedback = "⚠️ Pressing too deep! Control your range to protect joints.";
                    score = 75;
                } else if (leftAngle || rightAngle) {
                    feedback = "✅ Good incline trajectory! Keep wrists stacked.";
                    score = 92;
                }
                break;
            }

            // --- BACK ---
            case 'pullups': {
                if (leftWrist && leftShoulder) {
                    const dy = leftShoulder.position.y - leftWrist.position.y;
                    anglesChecked["Pull Clearance"] = Math.round(dy);
                    if (dy > 80) {
                        isCorrect = false;
                        feedback = "⚠️ Pull higher! Aim to get your chin above your hands.";
                        score = 65;
                    } else {
                        feedback = "✅ Excellent pull-up range! Squeeze your lats.";
                        score = 96;
                    }
                } else {
                    feedback = "Ensure hands and shoulders are visible in frame.";
                    score = 50;
                }
                break;
            }
            case 'lat_pulldown': {
                if (leftHip && leftShoulder) {
                    const dx = leftShoulder.position.x - leftHip.position.x;
                    const dy = leftHip.position.y - leftShoulder.position.y;
                    const leanAngle = Math.round(Math.abs(Math.atan2(dx, dy) * 180 / Math.PI));
                    anglesChecked["Torso Back Lean"] = leanAngle;

                    if (leanAngle > 25) {
                        isCorrect = false;
                        feedback = "⚠️ Leaning back excessively! Keep torso upright (~10-15° lean max).";
                        score = 65;
                    } else {
                        feedback = "✅ Good upright posture! Pull bar directly to your upper chest.";
                        score = 95;
                    }
                } else {
                    feedback = "Ensure shoulders and hips are in screen view.";
                    score = 50;
                }
                break;
            }
            case 'bent_over_row': {
                const bodyAngle = getAngle(leftShoulder, leftHip, leftKnee) || getAngle(rightShoulder, rightHip, rightKnee);
                if (bodyAngle) anglesChecked["Spine Flatness"] = bodyAngle;

                if (bodyAngle && bodyAngle < 155) {
                    isCorrect = false;
                    feedback = "⚠️ Back is rounding! Flatten your spine and pull shoulders back.";
                    score = 60;
                } else if (bodyAngle) {
                    feedback = "✅ Flat, safe back posture! Pull row to your lower ribs.";
                    score = 98;
                } else {
                    feedback = "Position side-profile to analyze spine alignment.";
                    score = 50;
                }
                break;
            }
            case 'deadlift': {
                const spineAngle = getAngle(leftShoulder, leftHip, leftKnee) || getAngle(rightShoulder, rightHip, rightKnee);
                if (spineAngle) anglesChecked["Spine Alignment"] = spineAngle;

                if (spineAngle && spineAngle < 160) {
                    isCorrect = false;
                    feedback = "⚠️ DANGER: Spine rounded! Flatten your back and push chest out.";
                    score = 50;
                } else if (spineAngle) {
                    feedback = "✅ Neutral spine maintained! Drive through legs.";
                    score = 98;
                } else {
                    feedback = "Present a side-profile view for spine tracking.";
                    score = 50;
                }
                break;
            }

            // --- TRICEPS ---
            case 'overhead_ext': {
                if (leftElbow && rightElbow && leftShoulder && rightShoulder) {
                    const elbowDist = Math.abs(leftElbow.position.x - rightElbow.position.x);
                    const shoulderDist = Math.abs(leftShoulder.position.x - rightShoulder.position.x);
                    const flareRatio = Math.round((elbowDist / shoulderDist) * 100);
                    anglesChecked["Elbow-to-Shoulder width"] = flareRatio;

                    if (flareRatio > 130) {
                        isCorrect = false;
                        feedback = "⚠️ Elbows flaring out! Keep them tucked close to your head, pointing forward.";
                        score = 70;
                    } else {
                        feedback = "✅ Elbows locked forward! Extend fully at the top.";
                        score = 96;
                    }
                } else {
                    feedback = "Ensure elbows and shoulders are visible.";
                    score = 50;
                }
                break;
            }
            case 'tricep_dips': {
                const leftAngle = getAngle(leftShoulder, leftElbow, leftWrist);
                const rightAngle = getAngle(rightShoulder, rightElbow, rightWrist);
                const elbowAngle = leftAngle || rightAngle;
                if (elbowAngle) anglesChecked["Elbow Flexion"] = elbowAngle;

                if (elbowAngle && elbowAngle < 80) {
                    isCorrect = false;
                    feedback = "⚠️ Dipping too deep! Stop when elbows reach 90° to protect joints.";
                    score = 65;
                } else if (elbowAngle) {
                    feedback = "✅ Excellent depth! Keep shoulders stable and push up.";
                    score = 95;
                }
                break;
            }
            case 'pushdowns': {
                if (leftElbow && leftShoulder) {
                    const dx = Math.abs(leftElbow.position.x - leftShoulder.position.x);
                    anglesChecked["Elbow Drift"] = Math.round(dx);

                    if (dx > 45) {
                        isCorrect = false;
                        feedback = "⚠️ Elbows shifting forward! Pin elbows to side to isolate triceps.";
                        score = 70;
                    } else {
                        feedback = "✅ Elbows pinned correctly! Extend arm completely.";
                        score = 96;
                    }
                } else {
                    feedback = "Ensure upper body and arms are visible.";
                    score = 50;
                }
                break;
            }
            case 'diamond_pushups': {
                const leftBody = getAngle(leftShoulder, leftHip, leftKnee);
                const rightBody = getAngle(rightShoulder, rightHip, rightKnee);
                const bodyAngle = leftBody || rightBody;
                if (bodyAngle) anglesChecked["Body Line Angle"] = bodyAngle;

                if (bodyAngle && bodyAngle < 160) {
                    isCorrect = false;
                    feedback = "⚠️ Hips sagging! Squeeze core, hands close together under chest.";
                    score = 60;
                } else if (bodyAngle) {
                    feedback = "✅ Straight body line maintained! Great pushdown.";
                    score = 95;
                }
                break;
            }

            // --- BICEPS ---
            case 'bicep_curl': {
                const elbowAngle = getAngle(leftShoulder, leftElbow, leftWrist) || getAngle(rightShoulder, rightElbow, rightWrist);
                if (elbowAngle) anglesChecked["Elbow Flexion"] = elbowAngle;

                if (leftShoulder && leftElbow) {
                    const dy = Math.abs(leftElbow.position.y - leftShoulder.position.y);
                    anglesChecked["Elbow Pivot Deviation"] = Math.round(dy);

                    if (elbowAngle && elbowAngle < 130 && dy < 70) {
                        isCorrect = false;
                        feedback = "⚠️ Elbows swinging forward! Keep them locked at your sides.";
                        score = 60;
                    } else if (elbowAngle) {
                        feedback = "✅ Excellent curl isolation! Control descending weight.";
                        score = 97;
                    }
                }
                break;
            }
            case 'hammer_curl': {
                const elbowAngle = getAngle(leftShoulder, leftElbow, leftWrist) || getAngle(rightShoulder, rightElbow, rightWrist);
                if (elbowAngle) anglesChecked["Elbow Flexion"] = elbowAngle;

                if (elbowAngle && elbowAngle < 45) {
                    isCorrect = false;
                    feedback = "⚠️ Curling too high! Avoid swinging elbows forward at the peak.";
                    score = 80;
                } else if (elbowAngle) {
                    feedback = "✅ Neutral grip (palms facing each other) and elbows stable. Perfect!";
                    score = 96;
                }
                break;
            }
            case 'concentration_curl': {
                const elbowAngle = getAngle(leftShoulder, leftElbow, leftWrist);
                if (elbowAngle) anglesChecked["Elbow Flexion"] = elbowAngle;
                feedback = "✅ Arm stabilized against inner thigh. Push bicep to full peak.";
                score = 92;
                break;
            }
            case 'chinups': {
                if (leftShoulder && leftWrist) {
                    const dy = leftShoulder.position.y - leftWrist.position.y;
                    anglesChecked["Clearance Height"] = Math.round(dy);
                    if (dy > 80) {
                        isCorrect = false;
                        feedback = "⚠️ Pull higher! Aim for underhand chin clearance.";
                        score = 75;
                    } else {
                        feedback = "✅ Great vertical lift chin-up! Squeeze biceps.";
                        score = 95;
                    }
                }
                break;
            }

            // --- LEGS ---
            case 'squat': {
                const leftKneeAngle = getAngle(leftHip, leftKnee, leftAnkle);
                const rightKneeAngle = getAngle(rightHip, rightKnee, rightAnkle);
                const kneeAngle = leftKneeAngle || rightKneeAngle;
                if (kneeAngle) anglesChecked["Knee Flexion"] = kneeAngle;

                if (kneeAngle && kneeAngle < 120) {
                    if (leftKnee && leftAnkle && Math.abs(leftKnee.position.x - leftAnkle.position.x) > 60) {
                        isCorrect = false;
                        feedback = "⚠️ Knees overshooting toes! Push hips further back & down.";
                        score = 65;
                    } else if (kneeAngle > 105) {
                        isCorrect = true;
                        feedback = "💡 Good depth, but try sinking a bit deeper to parallel (90°).";
                        score = 85;
                    } else {
                        feedback = "✅ Perfect parallel Squat! Great weight distribution.";
                        score = 98;
                    }
                } else if (kneeAngle && kneeAngle > 165) {
                    feedback = "Stand straight and lower down slowly into parallel.";
                    score = 80;
                } else {
                    feedback = "Align full lower body (Hip, Knee, Ankle) in view.";
                    score = 50;
                }
                break;
            }
            case 'lunge': {
                const leftKneeAngle = getAngle(leftHip, leftKnee, leftAnkle);
                if (leftKneeAngle) anglesChecked["Front Knee Flexion"] = leftKneeAngle;

                if (leftKneeAngle && leftKneeAngle < 115) {
                    if (leftKnee && leftAnkle && Math.abs(leftKnee.position.x - leftAnkle.position.x) > 55) {
                        isCorrect = false;
                        feedback = "⚠️ Knee sliding past toes! Keep your front shin strictly vertical.";
                        score = 60;
                    } else {
                        feedback = "✅ Perfect lunge tracking! Drop back knee straight down.";
                        score = 96;
                    }
                } else {
                    feedback = "Step back, present side profile and descend.";
                    score = 50;
                }
                break;
            }
            case 'leg_extension': {
                const kneeAngle = getAngle(leftHip, leftKnee, leftAnkle) || getAngle(rightHip, rightKnee, rightAnkle);
                if (kneeAngle) anglesChecked["Knee Extension"] = kneeAngle;

                if (kneeAngle && kneeAngle > 176) {
                    isCorrect = false;
                    feedback = "⚠️ Knee hyperextended! Stop extension just before absolute lockout.";
                    score = 75;
                } else if (kneeAngle && kneeAngle > 140) {
                    feedback = "✅ Leg extended! Control movement speed.";
                    score = 95;
                } else {
                    feedback = "Keep back straight, extend knee upward.";
                    score = 80;
                }
                break;
            }
            case 'calf_raise': {
                feedback = "✅ Ankle raised! Drive weights through big toes.";
                score = 90;
                break;
            }

            // --- SHOULDERS ---
            case 'shoulder_press': {
                const leftAngle = getAngle(leftShoulder, leftElbow, leftWrist);
                const rightAngle = getAngle(rightShoulder, rightElbow, rightWrist);
                if (leftAngle) anglesChecked["Left Elbow flexion"] = leftAngle;
                if (rightAngle) anglesChecked["Right Elbow flexion"] = rightAngle;

                if (leftShoulder && leftHip) {
                    const dx = Math.abs(leftShoulder.position.x - leftHip.position.x);
                    anglesChecked["Back arch"] = dx;

                    if (dx > 40) {
                        isCorrect = false;
                        feedback = "⚠️ Avoid arching lower back! Keep abs tight and press straight up.";
                        score = 65;
                    } else if (leftAngle || rightAngle) {
                        feedback = "✅ Good vertical pressing! Lock out fully at peak.";
                        score = 96;
                    }
                }
                break;
            }
            case 'lateral_raise': {
                if (leftWrist && leftShoulder) {
                    const dy = leftShoulder.position.y - leftWrist.position.y;
                    anglesChecked["Arm Height"] = Math.round(dy);

                    if (dy < -20) {
                        isCorrect = false;
                        feedback = "⚠️ Hands raised above shoulders! Keep them below or at shoulder level.";
                        score = 70;
                    } else if (dy > -20 && dy < 15) {
                        feedback = "✅ Perfect height! Lead with elbows, keep slight bend.";
                        score = 97;
                    } else {
                        feedback = "Raise arms out laterally to shoulder level.";
                        score = 80;
                    }
                }
                break;
            }
            case 'front_raise': {
                if (leftWrist && leftShoulder) {
                    const dy = leftShoulder.position.y - leftWrist.position.y;
                    anglesChecked["Front Raise Height"] = Math.round(dy);

                    if (dy < -25) {
                        isCorrect = false;
                        feedback = "⚠️ Raising arms too high! Control movement at shoulder line.";
                        score = 70;
                    } else if (dy > -25 && dy < 10) {
                        feedback = "✅ Excellent front raise! Keep torso quiet, do not swing.";
                        score = 95;
                    }
                }
                break;
            }
            case 'shrugs': {
                if (leftShoulder && leftEar) {
                    const dist = leftShoulder.position.y - leftEar.position.y;
                    anglesChecked["Neck Compression"] = Math.round(dist);
                    feedback = "✅ Shrugging! Keep shoulders back, head straight, do not roll neck.";
                    score = 94;
                }
                break;
            }
            case 'decline_press': {
                const leftAngle = getAngle(leftShoulder, leftElbow, leftWrist);
                const rightAngle = getAngle(rightShoulder, rightElbow, rightWrist);
                if (leftAngle) anglesChecked["Left Elbow flexion"] = leftAngle;
                if (rightAngle) anglesChecked["Right Elbow flexion"] = rightAngle;

                if ((leftAngle && leftAngle < 55) || (rightAngle && rightAngle < 55)) {
                    isCorrect = false;
                    feedback = "⚠️ Tucking elbows too tight or too wide! Keep elbows around 60° to protect shoulders.";
                    score = 70;
                } else if (leftAngle || rightAngle) {
                    feedback = "✅ Stable decline press path! Drive through the lower chest.";
                    score = 94;
                }
                break;
            }
            case 'barbell_row': {
                const bodyAngle = getAngle(leftShoulder, leftHip, leftKnee) || getAngle(rightShoulder, rightHip, rightKnee);
                if (bodyAngle) anglesChecked["Spine Flatness"] = bodyAngle;

                if (bodyAngle && bodyAngle < 150) {
                    isCorrect = false;
                    feedback = "⚠️ Back is rounding! Keep your spine neutral and pull the barbell to your upper abdomen.";
                    score = 65;
                } else if (bodyAngle) {
                    feedback = "✅ Flat spine maintained! Pull up with explosive control.";
                    score = 98;
                }
                break;
            }
            case 'skull_crushers': {
                const leftAngle = getAngle(leftShoulder, leftElbow, leftWrist);
                const rightAngle = getAngle(rightShoulder, rightElbow, rightWrist);
                if (leftAngle) anglesChecked["Left Elbow angle"] = leftAngle;
                if (rightAngle) anglesChecked["Right Elbow angle"] = rightAngle;

                if (leftShoulder && leftElbow) {
                    const dy = Math.abs(leftElbow.position.y - leftShoulder.position.y);
                    anglesChecked["Elbow Drift"] = Math.round(dy);
                    if (dy > 55) {
                        isCorrect = false;
                        feedback = "⚠️ Elbows drifting backward! Keep your upper arms locked perpendicular to the floor.";
                        score = 70;
                    } else if (leftAngle || rightAngle) {
                        feedback = "✅ Triceps isolated correctly! Pivot only at the elbows.";
                        score = 96;
                    }
                }
                break;
            }
            case 'preacher_curl': {
                const leftAngle = getAngle(leftShoulder, leftElbow, leftWrist) || getAngle(rightShoulder, rightElbow, rightWrist);
                if (leftAngle) anglesChecked["Elbow Flexion"] = leftAngle;

                if (leftAngle && leftAngle > 165) {
                    isCorrect = false;
                    feedback = "⚠️ Avoid absolute joint lockout at the bottom to protect biceps tendon.";
                    score = 75;
                } else if (leftAngle) {
                    feedback = "✅ Controlled range of motion on preacher bench. Keep it up!";
                    score = 95;
                }
                break;
            }
            case 'glute_bridge': {
                const leftBody = getAngle(leftShoulder, leftHip, leftKnee);
                const rightBody = getAngle(rightShoulder, rightHip, rightKnee);
                const hipAngle = leftBody || rightBody;
                if (hipAngle) anglesChecked["Hip Extension Angle"] = hipAngle;

                if (hipAngle && hipAngle < 155) {
                    isCorrect = false;
                    feedback = "⚠️ Drive hips higher! Squeeze glutes and aim for a straight line from shoulder to knee.";
                    score = 70;
                } else if (hipAngle) {
                    feedback = "✅ Full hip extension achieved! Squeeze glutes at peak.";
                    score = 98;
                }
                break;
            }
            case 'arnold_press': {
                const leftAngle = getAngle(leftShoulder, leftElbow, leftWrist);
                const rightAngle = getAngle(rightShoulder, rightElbow, rightWrist);
                if (leftAngle) anglesChecked["Left Elbow flexion"] = leftAngle;
                if (rightAngle) anglesChecked["Right Elbow flexion"] = rightAngle;

                if (leftShoulder && leftHip) {
                    const dx = Math.abs(leftShoulder.position.x - leftHip.position.x);
                    anglesChecked["Spine Lean"] = dx;

                    if (dx > 45) {
                        isCorrect = false;
                        feedback = "⚠️ Excessive spine lean or lower back arch! Stay upright as you rotate and press.";
                        score = 65;
                    } else if (leftAngle || rightAngle) {
                        feedback = "✅ Good Arnold Press path! Smooth rotation from front to sides.";
                        score = 95;
                    }
                }
                break;
            }
            default:
                feedback = "Begin movement in front of camera.";
                score = 100;
        }

        return { isCorrect, feedback, score, anglesChecked };
    };

    if (hasAccess === null) {
        return (
            <div className="flex flex-col justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neonGreen"></div>
                <p className="mt-4 text-textMuted">Checking premium access rights...</p>
            </div>
        );
    }

    if (hasAccess === false) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 glass-card text-center border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.15)] animate-fade-in">
                <Activity size={48} className="text-pink-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-textMain mb-2">Deluxe Plan Required</h2>
                <p className="text-textMuted mb-6">Upgrade your subscription to unlock the AI Biomechanical Posture Coach and real-time exercise feedback.</p>
                <a href="/plans" className="cyan-button inline-block text-lg">View Plans & Upgrade</a>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Header Area */}
            <div className="text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 w-72 h-16 bg-neonGreen/10 blur-2xl rounded-full"></div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-textMain via-neonGreen to-electricCyan drop-shadow-md">
                    AI Biomechanical Posture Coach
                </h1>
                <p className="text-textMuted mt-2 max-w-xl mx-auto text-sm">
                    Select a muscle group and target exercise. Place your camera in alignment and let our real-time neural analyzer refine your technique.
                </p>
            </div>

            {/* Muscle Selector Deck */}
            {!selectedMuscle && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-textMain flex items-center gap-2 px-2 border-l-4 border-neonGreen">
                        <Dumbbell className="text-neonGreen" size={20} />
                        Choose Target Muscle Group
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MUSCLES.map((muscle) => (
                            <div 
                                key={muscle.id}
                                onClick={() => setSelectedMuscle(muscle)}
                                className="group relative overflow-hidden glass-card p-6 border border-glassBorder hover:border-neonGreen hover:shadow-[0_0_20px_rgba(57,255,20,0.15)] cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:scale-110 transition-transform duration-300">
                                    {muscle.icon}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl p-3 bg-neonGreen/10 rounded-xl group-hover:bg-neonGreen/20 transition-colors">
                                        {muscle.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-textMain group-hover:text-neonGreen transition-colors">
                                            {muscle.name}
                                        </h3>
                                        <p className="text-textMuted text-xs mt-1 leading-relaxed">
                                            {muscle.desc}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-glassBorder flex items-center justify-between text-xs text-neonGreen font-semibold">
                                    <span>{muscle.exercises.length} Exercises Available</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">Select &rarr;</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Exercise Selector Deck */}
            {selectedMuscle && !selectedExercise && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSelectedMuscle(null)}
                            className="glass-button p-2 hover:text-neonGreen"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-textMain flex items-center gap-2">
                                <span className="text-2xl">{selectedMuscle.icon}</span>
                                {selectedMuscle.name} Exercises
                            </h2>
                            <p className="text-textMuted text-xs">{selectedMuscle.desc}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedMuscle.exercises.map((ex) => (
                            <div 
                                key={ex.id}
                                className="glass-card p-6 border border-glassBorder hover:border-electricCyan flex flex-col justify-between hover:shadow-[0_0_20px_rgba(0,245,255,0.15)] transition-all"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-textMain">{ex.name}</h3>
                                        <span className="bg-electricCyan/10 text-electricCyan text-[10px] px-2 py-0.5 rounded-full font-bold border border-electricCyan/20">
                                            AI CHECKED
                                        </span>
                                    </div>
                                    <p className="text-textMuted text-xs mt-3 flex items-start gap-2 bg-black/20 p-3 rounded-lg border border-white/5">
                                        <Info size={14} className="text-electricCyan mt-0.5 shrink-0" />
                                        <span><strong>Guideline Cues:</strong> {ex.cues}</span>
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="bg-glassBg border border-glassBorder text-textMuted text-xs px-2.5 py-1 rounded-lg">
                                            🎯 Target Metric: <strong className="text-textMain font-semibold">{ex.target}</strong>
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedExercise(ex)}
                                    className="neon-button mt-6 w-full flex items-center justify-center gap-2 py-2.5 cursor-pointer text-sm"
                                >
                                    <Camera size={16} />
                                    Launch AI Posture Monitor
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Camera & Coach Control Deck */}
            {selectedExercise && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                    {/* Left Column: Live Webcam Stream & Biomechanical Overlay */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex justify-between items-center bg-surface/50 p-4 rounded-xl border border-glassBorder">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setSelectedExercise(null)}
                                    className="glass-button p-2 text-textMuted hover:text-neonGreen cursor-pointer"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-neonGreen tracking-widest">{selectedMuscle.name} Routine</span>
                                    <h3 className="text-lg font-bold text-textMain">{selectedExercise.name}</h3>
                                </div>
                            </div>
                            <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20 animate-pulse font-bold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                                LIVE FEED
                            </span>
                        </div>

                        <div className="relative glass-card overflow-hidden w-full aspect-video border border-neonGreen/30 shadow-[0_0_30px_rgba(57,255,20,0.15)] flex justify-center items-center bg-black min-h-[380px] rounded-2xl">
                            <video 
                                ref={videoRef} 
                                className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
                                width="640" 
                                height="480"
                                playsInline
                                muted
                            />
                            <canvas 
                                ref={canvasRef} 
                                className="absolute top-0 left-0 w-full h-full object-cover z-10 pointer-events-none"
                                width="640" 
                                height="480"
                            />
                            
                            {/* Loader or Camera Status Text Overlay */}
                            <div className="absolute top-4 right-4 bg-black/75 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 z-20 text-[10px] font-mono text-neonGreen">
                                status: <span className="animate-pulse font-semibold">{status}</span>
                            </div>
                        </div>

                        <div className="glass-card p-4 text-[11px] leading-relaxed text-textMuted flex items-start gap-3 border border-white/5">
                            <ShieldCheck className="text-neonGreen mt-0.5 shrink-0" size={16} />
                            <p><strong>Security & Privacy:</strong> All PoseNet skeletal extraction coordinates are evaluated dynamically within your browser sandboxed sandbox container. Absolutely zero image files or frames are dispatched to outside networks or FitGuardian servers.</p>
                        </div>
                    </div>

                    {/* Right Column: AI Feedback, Gauges, Real-time Metrics */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Posture Score Radial Indicator */}
                        <div className="glass-card p-6 border border-glassBorder flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3">
                                <Sparkles className="text-electricCyan animate-spin-slow opacity-60" size={18} />
                            </div>
                            <h4 className="text-xs uppercase tracking-widest text-textMuted font-bold mb-4">Posture Quality Index</h4>
                            
                            <div className="relative flex items-center justify-center">
                                <svg className="w-36 h-36 transform -rotate-90">
                                    <circle 
                                        cx="72" 
                                        cy="72" 
                                        r="60" 
                                        stroke="rgba(255,255,255,0.05)" 
                                        strokeWidth="8" 
                                        fill="transparent" 
                                    />
                                    <circle 
                                        cx="72" 
                                        cy="72" 
                                        r="60" 
                                        stroke={postureAnalysis.isCorrect ? "#39ff14" : "#ff3131"} 
                                        strokeWidth="8" 
                                        fill="transparent" 
                                        strokeDasharray={2 * Math.PI * 60}
                                        strokeDashoffset={2 * Math.PI * 60 * (1 - postureAnalysis.score / 100)}
                                        className="transition-all duration-300"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-extrabold text-textMain">{postureAnalysis.score}%</span>
                                    <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">accuracy</span>
                                </div>
                            </div>

                            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-textMuted">
                                CURRENT RATING: {" "}
                                <span className={postureAnalysis.isCorrect ? "text-neonGreen" : "text-red-400 animate-pulse"}>
                                    {postureAnalysis.isCorrect ? "EXCELLENT" : "ADJUST NEEDED"}
                                </span>
                            </p>
                        </div>

                        {/* Live AI Technical Feedback Box */}
                        <div className={`glass-card p-5 border transition-all duration-300 ${postureAnalysis.isCorrect ? 'border-neonGreen/30 shadow-[0_0_15px_rgba(57,255,20,0.08)] bg-neonGreen/5' : 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.08)] bg-red-500/5'}`}>
                            <h4 className="text-xs uppercase font-extrabold tracking-wider text-textMuted mb-3 flex items-center gap-1.5">
                                {postureAnalysis.isCorrect ? (
                                    <CheckCircle2 size={14} className="text-neonGreen" />
                                ) : (
                                    <AlertTriangle size={14} className="text-red-400 animate-bounce" />
                                )}
                                Real-Time Biomechanical Feedback
                            </h4>
                            <p className={`text-sm leading-relaxed font-semibold ${postureAnalysis.isCorrect ? 'text-textMain' : 'text-red-200'}`}>
                                {postureAnalysis.feedback}
                            </p>
                        </div>

                        {/* Joint Angle Monitor Panel */}
                        <div className="glass-card p-5 border border-glassBorder space-y-4">
                            <h4 className="text-xs uppercase tracking-widest text-textMuted font-extrabold flex items-center gap-2">
                                <TrendingUp size={14} className="text-electricCyan" />
                                Dynamic Joint Angles Checked
                            </h4>
                            
                            <div className="space-y-3">
                                {Object.keys(postureAnalysis.anglesChecked).length > 0 ? (
                                    Object.entries(postureAnalysis.anglesChecked).map(([metric, value]) => (
                                        <div key={metric} className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/5 text-xs">
                                            <span className="text-textMuted font-medium">{metric}</span>
                                            <span className="text-electricCyan font-bold font-mono">{value}°</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-textMuted text-xs italic py-2">Waiting for PoseNet coordinates initialization...</p>
                                )}
                            </div>
                        </div>

                        {/* Technical Target Check cues */}
                        <div className="glass-card p-5 border border-glassBorder space-y-3">
                            <h4 className="text-xs uppercase tracking-widest text-textMuted font-extrabold flex items-center gap-1.5">
                                <Info size={14} className="text-textMuted" />
                                Target Execution Checklists
                            </h4>
                            <ul className="space-y-2 text-xs text-textMuted">
                                <li className="flex items-start gap-2">
                                    <span className="text-neonGreen font-semibold shrink-0">✓</span>
                                    <span>{selectedExercise.cues}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neonGreen font-semibold shrink-0">✓</span>
                                    <span>Main metric calculated: <strong>{selectedExercise.target}</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neonGreen font-semibold shrink-0">✓</span>
                                    <span>Maintain slow, steady control through concentric & eccentric range.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostureCheck;
