

import { createPage, ajax, base,toast } from 'nc-lightapp-front';

export default function (props) {
 let meta = {};
 meta = {
		"importLogs": {
			"code": "importLogs",
			"items": [{
					label: "行日志",
					attrcode: "linelog",
					col: 4,
					itemtype: "input",//select
                    visible: true,
				}
			],
			moduletype: "table",
			name: "importLogs",
			pagination: true,
            vometa: "importLogs",
            // status: 'browse'
                        
		},   
    };
   this.props.meta.addMeta(meta)
}