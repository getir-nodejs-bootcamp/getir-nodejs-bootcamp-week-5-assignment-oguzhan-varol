const {insert,list,loginUser,modify,remove,update} = require("../services/Users")

const hs = require("http-status")
const {passwordToHash, generateAccessToken, generateRefreshToken} = require("../scripts/utils/helper")
const uuid = require("uuid")
const eventEmitter = require("../scripts/events/eventEmitter")



const create = (req,res) =>{

    req.body.password=passwordToHash(req.body.password)
    insert(req.body).then(create=>{
        
        
        eventEmitter.emit("send_create_email",{
            
            to: create.email,
            subject: "Üye Kayıdı Başarı ile tamamlandı ✔", 
            
            html: `Merhaba ${create.first_name} ${create.last_name} Üyelik işleminiz başarı ile gerçekleştirilmiştir. <br /> Getirin taklidi değiliz sadece getirden daha iyiyiz 🥳🥳. <h1> Götür Company </h1>`, // html body
          },
        ) 
        
       res.status(hs.OK).send(create)
          
          
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
            
            html: `Merhaba ${updatedUser.first_name}" "${updatedUser.last_name} Şifre sıfırlama işleminiz başarı ile gerçekleştirilmiştir. <br /> Giriş yaptıktan sonra şifrenizi değiştirmeyi unutmayınız. <br /> Yeni Şifreniz:<b>${new_password}</b> <h1> Götür Company </h1>`, // html body
          },
        )
        eventEmitter.emit('send_sms', {
            body: `Şifre değişikliğiniz başarı ile tamamlanmıştır. Yeni şifreniz: ${new_password}. Lütfen şifrenizi değiştirmeyi unutmayın :)`,
            to: `+${updatedUser.phones}`,
        });
        console.log(updatedUser.phones)
        
          
          res.status(hs.OK).send({
              message:"Şifre sıfırlama için sisteme kayıtlı e-posta adresinize ve telefonunuza gönderildi bilgi gönderildi :)"
          })
    })
    .catch(()=>{
        res.status(hs.INTERNAL_SERVER_ERROR).send({error:"Şifre değişleme sırasında hata oluştu."})
    })

}


const updateUser = (req,res)=>{
    if(!req.params?.id){
        return res.status(hs.BAD_REQUEST).send({message:"ID bilgisi eksik"});
    }
    update(req.params.id,req.body).then((updatedUser)=>{
        res.status(hs.OK).send(updatedUser)
        console.log("user güncellendi")
    })
    .catch(()=>{
        res.status(hs.INTERNAL_SERVER_ERROR).send({error:"Update işlemi sırasında problem oluştu."})
    })
}

const deleteUser = (req,res) =>{
    if(!req.params?.id){
        return res.status(hs.BAD_REQUEST).send({message:"ID bilgisi eksik"});
    }

    remove(req.params?.id)
    .then((deletedUser)=>{
        console.log(deletedUser)
        if(!deletedUser){
           return res.status(hs.NOT_FOUND).send({message:"Böyle bir kullanıcı bulunmamaktadır."})
        }
        res.status(hs.OK).send({message:"Kullanıcı başarı ile silindi"});
    })
    .catch((e)=>{
        res.status(hs.INTERNAL_SERVER_ERROR).send({error:"Silme işlemi sırasında problem oluştu"})
    })

}
const changePassword = (req,res) =>{

    req.body.password = passwordToHash(req.body.password);
    modify({_id:req.user?._doc?._id},req.body)
    .then((update)=>{
        console.log(req.user._doc._id)
        res.status(hs.OK).send(update)
    })
    .catch(()=> res.status(hs.INTERNAL_SERVER_ERROR).send({error:"Güncelleme sırasında bir hata oluştu"}))
}

module.exports = {
    create,
    index,
    login,
    resetPassword,
    updateUser,
    deleteUser,
    changePassword,
}