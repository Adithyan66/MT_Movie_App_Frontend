



import React from 'react';
import SpinnerLogo from '../assets/image.png'



type RotatingSpinnerProps = {
    fullscreen?: boolean;
};

const LoadingSpinner: React.FC<RotatingSpinnerProps> = ({ fullscreen = true }) => {
    const containerClasses = fullscreen
        ? 'flex items-center justify-center min-h-screen bg-black bg-opacity-80'
        : 'flex items-center justify-center';

    return (
        <div className={containerClasses}>
            <div className="text-center">
                <div className="relative inline-block">
                    <img
                        src={SpinnerLogo}
                        alt="Loading spinner"
                        className="w-12 h-12 animate-spin"
                        style={{ animationDuration: '2s' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;