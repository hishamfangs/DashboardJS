/**** UserProfile Class
 *		
 *	Recordset Class for creating, attaching and managing
 *	Recordsets, which in UI terms takes the shape of Tabs & Their Panels.
 *	Tabs Handle switching from one recordset to another, while
 *	Panels hold the record. 
 * 
******************* */

function UserProfile(settings) {

	Component.call(this, settings);
	this.dashboard = settings.dashboard;
	//this.setLink(url);
}
UserProfile.prototype = Object.create(Component.prototype);
UserProfile.prototype.constructor = UserProfile;

UserProfile.defaultTemplate = {
	wrapper: "",
	item: ".user-container",
	itemText: ".name",
	itemIcon: "",
	itemLink: "",
	itemImage: "img",
	container: ""
};
