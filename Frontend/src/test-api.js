export const testLoginAndToken = async () => {
    const loginUrl = 'http://localhost:8000/api/auth/login';
    const credentials = {
        email: 'admin@isp.net',
        password: 'password'
    };

    console.log("Starting Test Conectivity API");

    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Login Succcessful");

            const token = data.data.token;

            if (token) {
                localStorage.setItem('user_token', token);
                console.log("Token stored successfully");

                verifyTokenSaved();
            } else {
                console.error("Login Success butToken not found in response");
            }
        } else {
            console.error("login failed:", data.message || response.statusText)
        }
    } catch (error) {
        console.error("Internal Server Error:", error)
    }
};

export const verifyTokenSaved = () => {
    const token = localStorage.getItem('user_token');
    if (token) {
        console.log("Token is saved successfully");
    } else {
        console.error("Token is not saved");
    }
}

export const testGetProfile = async () => {
    const token = localStorage.getItem('user_token');
    const userUrl = 'http://localhost:8000/api/auth/me';

    try {
        const response = await fetch(userUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            const userData = await response.json();
            console.log("success fetching User Data:", userData);
        } else {
            console.error("failed to fetch user data")
        }
    } catch (error) {
        console.error("Error Token Verification:", error);
    }
};

export const testLogout = async () => {
    const logoutUrl = 'http://localhost:8000/api/auth/logout';
    const token = localStorage.getItem('user_token');

    console.log("Starting logout test");

    if (!token) {
        console.error("Logout failed: Token not found");
        return;
    }

    try {
        const response = await fetch(logoutUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            const logoutData = await response.json();
            console.log("Logout successful token has been revoked from server");
            console.log("success logout data:", logoutData);

            //clear token from browser
            localStorage.removeItem('user_token');
            console.log("client: token has been revoked from localstorage");

            //verify token is removed
            verifyTokenSaved();
        }
    } catch (error) {
        console.error("Logout failed:", error);
    }
}