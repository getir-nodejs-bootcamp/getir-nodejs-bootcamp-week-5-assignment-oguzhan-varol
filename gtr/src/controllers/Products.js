const hs = require("http-status");
const {list,insert,findOne,updateDoc,remove} = require("../services/Products")
const path = require("path")

const index = (req,res) =>{
    list()
    .then((itemList)=>{
        if(!itemList){
            res.status(hs.INTERNAL_SERVER_ERROR).send({message:"Bir sorun oluştu"})

        }
        res.status(hs.OK).send(itemList)
    })
    .catch((e)=>{
        res.status(hs.INTERNAL_SERVER_ERROR).send(e)
    })
}

const create = (req,res) =>{
    req.body.user_id = req.user;
    insert(req.body)
    .then((createdDoc)=>{
        if(!createdDoc){
            res.status(hs.INTERNAL_SERVER_ERROR).send({error:"Bir sorun oluştu.."})
        }
        res.status(hs.OK).send(createdDoc);

    })
    .catch((e)=>{
        res.status(hs.INTERNAL_SERVER_ERROR).send(e)
    })
}

const update = (req,res) =>{
    if(!req.params.id){
        return res.status(hs.BAD_REQUEST).send({message:"Eksik bilgi..."})
    }
    updateDoc(req.params.id,req.body)
    .then((updateDoc)=>{
        if(!updateDoc){
            res.status(hs.NOT_FOUND).send({error:"Böyle bir ürün bulunmamaktadır.."})
        }
        res.status(hs.OK).send(updateDoc);
    })
    .catch((e)=>{
        res.status(hs.INTERNAL_SERVER_ERROR).send(e)
    })
}


const addComment = (req,res)=>{
    if(!req.params.id){
        return res.status(hs.NOT_FOUND).send({message:"Eksik bilgi..."})
    }
    findOne({_id:req.params.id})
    .then((mainProduct)=>{
        if(!mainProduct){
            return res.status(hs.NOT_FOUND).send({error:"Böyle bir ürün bulunmamaktadır"})

        }
        const comment = {
            ...req.body,
            created_at:new Date(),
            user_id:req.user,
        };
        mainProduct.comments.push(comment);
        updateDoc(req.params.id,mainProduct)
        .then((updatedDoc)=>{
            if(!updateDoc){
                return res.status(hs.NOT_FOUND).send({message:"Böyle bir ürün bulunmamaktadır.."})
            }
            res.status(hs.OK).send(updatedDoc);
        })
        .catch((e)=>{
            res.status(hs.INTERNAL_SERVER_ERROR).send(e);
        })
    })
}

const deleteProduct = (req,res) =>{
    if(!req.params?.id){
        return res.status(hs.BAD_REQUEST).send({message:"ID bilgisi eksik"});
    }

    remove(req.params?.id)
    .then((deletedProduct)=>{
        console.log(deletedProduct)
        if(!deletedProduct){
           return res.status(hs.NOT_FOUND).send({message:"Böyle bir ürün bulunmamaktadır."})
        }
        res.status(hs.OK).send({message:"Ürün başarı ile silindi"});
    })
    .catch((e)=>{
        res.status(hs.INTERNAL_SERVER_ERROR).send({error:"Silme işlemi sırasında problem oluştu"})
    })

}

const addProductImage = (req,res) =>{
    
    if(req?.files?.media){
        return res.status(hs.BAD_REQUEST).send({error:"Bu işlemi yapabilmek için media'ya ihtiyacınız var."})

    }
    
    const folderPath = path.join(__dirname,"../","uploads/Products")
    req.files.media.mv(folderPath,function(err){
        if(err){
            return res.status(hs.INTERNAL_SERVER_ERROR).send({error:"Upload işlemi sırasında hata oluştu."})

        }
    })
   
}


module.exports = {
    index,
    create,
    update,
    addComment,
    deleteProduct,
    addProductImage,

}