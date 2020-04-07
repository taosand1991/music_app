
const getUser =(props)=>{
    return localStorage.getItem('token')
};

export default getUser;
