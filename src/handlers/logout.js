const logout = async(Request, h)=>{
    return h.response({
        status:'success',
        message:'Logout Berhasil',
        data:{
            token:null
        }
    });
}

export default logout;