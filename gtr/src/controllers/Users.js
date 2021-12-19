const {insert,list,loginUser,modify} = require("../services/Users")

const hs = require("http-status")
const {passwordToHash, generateAccessToken, generateRefreshToken} = require("../scripts/utils/helper")
const uuid = require("uuid")
const eventEmitter = require("../scripts/events/eventEmitter")



const create = (req,res) =>{

    req.body.password=passwordToHash(req.body.password)
    insert(req.body).then(response=>{
        res.status(hs.OK).send(response)
    })
    .catch(e=>{
        res.status(hs.INTERNAL_SERVER_ERROR).send(e);
    })



}


const index = (req,res)=>{
    list().then((response) =>{
        res.status(hs.OK).send(response)
        console.log(response)

    })
    .catch(err=>{
        res.status(hs.INTERNAL_SERVER_ERROR).send(err)
    })
   
    
}

const login = (req,res) =>{
    req.body.password = passwordToHash(req.body.password)
    loginUser(req.body)
    .then((user) =>{
        if(!user) return res.status(hs.NOT_FOUND).send({message:"BÖYLE BİR KULLANICI YOK"})

        user = {
            ...user.toObject(),
            tokens:{
                access_token:generateAccessToken(user),
                refresh_token:generateRefreshToken(user),
            }
        }
        console.log(user)
        delete user.password
        res.status(hs.OK).send(user)} )
    .catch((e)=>res.status(hs.INTERNAL_SERVER_ERROR).send(e))


}

const resetPassword = (req,res)=>{
   
    
   
    
    

    const new_password = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`

    modify({email:req.body.email},{password:passwordToHash(new_password)}).then((updatedUser)=>{
          if(!updatedUser){
            res.status(hs.NOT_FOUND).send({error:"Böyle bir kullanıcı bulunamadı."})
            
          }
          
          eventEmitter.emit("send_email",{
            
            to: updatedUser.email,
            subject: "Şifre Sıfırlama ✔", 
            
            html: `Merhaba ${updatedUser.full_name} Şifre sıfırlama işleminiz başarı ile gerçekleştirilmiştir. <br /> Giriş yaptıktan sonra şifrenizi değiştirmeyi unutmayınız. <br /> Yeni Şifreniz:<b>${new_password}</b>`, // html body
          },
        ) 
          
          res.status(hs.OK).send({
              message:"Şifre sıfırlama için sisteme kayıtlı e-posta adresinize bilgi gönderildi :)"
          })
    })
    .catch(()=>{
        res.status(hs.INTERNAL_SERVER_ERROR).send({error:"Şifre değişleme sırasında hata oluştu."})
    })

}


const update = (req,res)=>{
    modify({_id:req.user?._id},req.body).then((updatedUser)=>{
        res.status(hs.OK).send(updatedUser)
    })
    .catch(()=>{
        res.status(hs.INTERNAL_SERVER_ERROR).send({error:"Update işlemi sırasında problem oluştu."})
    })
}

module.exports = {
    create,
    index,
    login,
    resetPassword,
    update,
}