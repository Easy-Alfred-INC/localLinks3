import React from 'react';

const KnowledgeBasePageConfig = {
	settings: {
		layout          : {
            config: {
                footer : {
                    display : false,
                },
            }
        },
	},
	routes: [
		{
			path: '/pages/knowledge-base',
			component: React.lazy(() => import('./KnowledgeBasePage'))
		}
	]
};

export default KnowledgeBasePageConfig;
