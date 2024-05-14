import React from 'react';
import '../css/backButton.css';
import {router} from "expo-router";

function BackButton(path) {
    return (
        <button
            className="button cursor-pointer active:scale-100"
            title="Go Back"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none' }}
            onClick={() => router.replace(path)}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40px"
                height="40px"
                viewBox="0 0 24 24"
                className="stroke-blue-300"
            >
                <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                    stroke={"red"}
                />
            </svg>
        </button>
    );
}

export default BackButton;

