module.exports = {
    checkPassword: function(p1,p2){
        if(p1 === p2){
            return true;
        }
        else{
            return false;
        }
    },
    checkIsEmpty:function(val){
        if(val.length ===0 || val==''){
            return true;
        }
        else{
            return false;
        }
    },
    checkUsername:function(val){
        if(val.length <9 && val.length >= 2){
            return false;
        }
        return true;
    },
    checkPasswordLength:function(val){
        if(val.length < 6){
            return true;
        }
        return false;
    }
}