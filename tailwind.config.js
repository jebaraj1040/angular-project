/** @type {import('tailwindcss').Config} */
module.exports = {
    // prefix: 'tw-',
    content: ["./src/**/*.{html,ts}"],
    theme: {
        // Replace existing default values
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            xxl: "1536px",
        },
        colors: {
            transparent: "transparent",
            white: "var(--white)",
            black: "var(--black)",
            red: "var(--red)",
            orange: "var(--orange)",
            green: "var(--green)",
        },
        // Customize existing default values (or) add new values
        extend: {
            // Common for Base, Components and Utilities
            screens: {
                sm: "640px",
                md: "768px",
                lg: "992px",
                xl: "1200px",
                xxl: "1680px",
                xxxl: "1920px",
            },
            // Components
            container: {
                screens: {
                    sm: "100%",
                    md: "768px",
                    lg: "992px",
                    xl: "1272px",
                },
            },
            // Utilities
            colors: {
                "primary-1": "var(--primary-1)",
                "primary-2": "var(--primary-2)",
                "secondary-1": "var(--secondary-1)",
                "secondary-2": "var(--secondary-2)",
                "secondary-3": "var(--secondary-3)",
                "secondary-4": "var(--secondary-4)",
                "secondary-5": "var(--secondary-5)",
                "secondary-6": "var(--secondary-6)",
            },
            // Utilities
            fontFamily: {
                "gilmer-light": "var(--font-light)",
                "gilmer-regular": "var(--font-regular)",
                "gilmer-medium": "var(--font-medium)",
                "gilmer-bold": "var(--font-bold)",
                "gilmer-heavy": "var(--font-heavy)",
            },
            fontSize: {
                10: ["10px", "18px"],
                12: ["12px", "20px"],
                14: ["14px", "22px"],
                16: ["16px", "24px"],
                18: ["18px", "28px"],
                20: ["20px", "28px"],
                22: ["22px", "30px"],
                24: ["24px", "32px"],
                26: ["26px", "34px"],
                28: ["28px", "36px"],
                30: ["30px", "38px"],
                32: ["32px", "40px"],
                34: ["34px", "42px"],
                36: ["36px", "44px"],
                38: ["38px", "46px"],
                40: ["40px", "48px"],
                42: ["42px", "50px"],
                44: ["44px", "52px"],
                46: ["46px", "54px"],
                48: ["48px", "56px"],
                50: ["50px", "58px"],
            },
        },
    },
    plugins: [],
};
