/**** UserProfile Class
 *		
 *	UserProfile Class
 * 
******************* */

function UserProfile(settings) {
	Component.call(this, settings);
	this.dashboard = settings.dashboard;
	//this.setLink(url);
}
UserProfile.prototype = Object.create(Component.prototype);
UserProfile.prototype.constructor = UserProfile;
