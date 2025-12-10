

export const SignupApi = async (formdata) => {
    try {

        const response = await fetch('http://localhost:3005/auth/signup',{
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify(formdata)
        });
        const data = await response.json();
        if (!response.ok){
            return {success:false, errors: data.errors}
        }
        return {success:true, message:data.message}

    } catch (error) {
        return {success:false, errors: [{msg:error.message}] }
    }
}


export const SigninApi = async (formData) => {
    try {
        const response = await fetch('http://localhost:3005/auth/signin',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(formData),
            credentials:'include'
        });
        const data = await response.json();
        if (!response.ok) {
            console.log(data.errors)
            return {success:false, errors:data.errors}
        }
        return {success:true, message:data.message, user:data.user, userData:data.userData,}
    } catch (error) {
        return {success:false, errors:[{msg:error.message}]}
    }

}

export const SignoutApi = async () => {
    try {
        const response = await fetch('http://localhost:3005/auth/signout',{
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            credentials:'include'
        });
        const data = await response.json();
        if (!response.ok) {
            return {success:false, errors:data.errors}
        }
        return {success:true, message:data.message}
    } catch (error) {
        return {success:false, errors:[{msg:error.message}]}
    }
}

