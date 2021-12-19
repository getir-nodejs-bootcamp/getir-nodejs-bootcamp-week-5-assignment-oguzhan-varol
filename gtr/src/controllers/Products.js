const hs = require("http-status");
const {list,insert,findOne,updateDoc} = require("../services/Products")


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



module.exports = {
    index,
    create,
    update,
    addComment,

}