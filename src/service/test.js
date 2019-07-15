let chain=function(fn){
  this.fn=fn;
  this.success=null;
  }
  chain.prototype.setSuccess=function(success){
  return this.success = success;
  }
  chain.prototype.next=function(){
  this.success && this.success.passRequest.apply(this.success,arguments);
  }
  chain.prototype.passRequest=function(){
  this.fn.apply(this,[this]);
  }
  let checkChain=new chain(this.checkIntegrityResume);
  let callJobTracker = new chain(this.callJobTracker);
  let saveChain=new chain(this.saveVolunteerInfo);
  let toDeliverChain=new chain(this.toDeliver);
  checkChain.setSuccess(callJobTracker).setSuccess(saveChain).setSuccess(toDeliverChain);
  checkChain.passRequest();
