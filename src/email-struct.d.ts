declare interface EmailStruct { // Must equals to /sed/raw api params
	to: string;
	subject: string;
	html: string;
	text?: string;
}
