/**** DashboardEvent Class
|*		
|*	DashboardEvent Class for creating, and Managing Custom Events
|*	
|* 
|********************/

function DashboardEvent(){
	this.completed = false;
	this.succeeded = false;
	this.failed = false;
	this.successEvent = {
			functionToRun: function(){},
			params: {}
	}
	this.failureEvent = {
			functionToRun: function(){},
			params: {}
	}
	this.completionEvent = {
			functionToRun: function(){},
			params: {}
	}
}
DashboardEvent.prototype.triggerCompleted = function (){
	this.completed = true;
	this.onComplete();
};

DashboardEvent.prototype.triggerSucceeded = function (){
	this.completed = true;
	this.succeeded = true;
	this.failed = false;    
	this.onComplete();
	this.onSuccess();
};

DashboardEvent.prototype.triggerFailed = function (){
	this.completed = true;
	this.succeeded = false;
	this.failed = true; 
	this.onComplete();
	this.onFailure();   
};

DashboardEvent.prototype.onComplete = function (){
	this.completionEvent.functionToRun(this.completionEvent.params);
};
DashboardEvent.prototype.onSuccess = function (){
	this.successEvent.functionToRun(this.successEvent.params);
};
DashboardEvent.prototype.onFailure = function (){
	this.failureEvent.functionToRun(this.failureEvent.params);
};

DashboardEvent.prototype.addSuccessEvent = function (functionToRun, params){
	this.successEvent.functionToRun = functionToRun;
	this.successEvent.params = params;
	if (this.succeeded){
			this.onSuccess();
	}   
};

DashboardEvent.prototype.addFailureEvent = function (functionToRun, params){
	this.failureEvent.functionToRun = functionToRun;
	this.failureEvent.params = params;
	if (this.failed){
			this.onFailure();
	}   
};

DashboardEvent.prototype.addCompletedEvent = function (functionToRun, params){
	this.completionEvent.functionToRun = functionToRun;
	this.completionEvent.params = params;
	if (this.completed){
			this.onComplete();
	}
};

DashboardEvent.prototype.result = null;
