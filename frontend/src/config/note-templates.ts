export const NOTE_TEMPLATES = [
    {
        id: 'blank',
        name: 'Blank Note',
        icon: '📄',
        content: '{}',
    },
    {
        id: 'meeting',
        name: 'Meeting Notes',
        icon: '📝',
        content: JSON.stringify({
            type: 'doc',
            content: [
                {
                    type: 'heading',
                    attrs: { level: 1 },
                    content: [{ type: 'text', text: 'Meeting Notes' }],
                },
                {
                    type: 'heading',
                    attrs: { level: 2 },
                    content: [{ type: 'text', text: 'Date & Time' }],
                },
                {
                    type: 'paragraph',
                    content: [{ type: 'text', text: new Date().toLocaleDateString() }],
                },
                {
                    type: 'heading',
                    attrs: { level: 2 },
                    content: [{ type: 'text', text: 'Attendees' }],
                },
                {
                    type: 'bulletList',
                    content: [
                        {
                            type: 'listItem',
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Name 1' }] }],
                        },
                        {
                            type: 'listItem',
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Name 2' }] }],
                        },
                    ],
                },
                {
                    type: 'heading',
                    attrs: { level: 2 },
                    content: [{ type: 'text', text: 'Agenda' }],
                },
                {
                    type: 'orderedList',
                    content: [
                        {
                            type: 'listItem',
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Topic 1' }] }],
                        },
                        {
                            type: 'listItem',
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Topic 2' }] }],
                        },
                    ],
                },
                {
                    type: 'heading',
                    attrs: { level: 2 },
                    content: [{ type: 'text', text: 'Notes' }],
                },
                {
                    type: 'paragraph',
                },
                {
                    type: 'heading',
                    attrs: { level: 2 },
                    content: [{ type: 'text', text: 'Action Items' }],
                },
                {
                    type: 'taskList',
                    content: [
                        {
                            type: 'taskItem',
                            attrs: { checked: false },
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Action item 1' }] }],
                        },
                        {
                            type: 'taskItem',
                            attrs: { checked: false },
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Action item 2' }] }],
                        },
                    ],
                },
            ],
        }),
    },
    {
        id: 'todo',
        name: 'Todo List',
        icon: '✅',
        content: JSON.stringify({
            type: 'doc',
            content: [
                {
                    type: 'heading',
                    attrs: { level: 1 },
                    content: [{ type: 'text', text: 'Todo List' }],
                },
                {
                    type: 'paragraph',
                    content: [{ type: 'text', text: new Date().toLocaleDateString() }],
                },
                {
                    type: 'heading',
                    attrs: { level: 2 },
                    content: [{ type: 'text', text: 'High Priority' }],
                },
                {
                    type: 'taskList',
                    content: [
                        {
                            type: 'taskItem',
                            attrs: { checked: false },
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Important task 1' }] }],
                        },
                    ],
                },
                {
                    type: 'heading',
                    attrs: { level: 2 },
                    content: [{ type: 'text', text: 'Medium Priority' }],
                },
                {
                    type: 'taskList',
                    content: [
                        {
                            type: 'taskItem',
                            attrs: { checked: false },
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Task 1' }] }],
                        },
                    ],
                },
                {
                    type: 'heading',
                    attrs: { level: 2 },
                    content: [{ type: 'text', text: 'Low Priority' }],
                },
                {
                    type: 'taskList',
                    content: [
                        {
                            type: 'taskItem',
                            attrs: { checked: false },
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'When you have time...' }] }],
                        },
                    ],
                },
            ],
        }),
    },
    {
        id: 'lecture',
        name: 'Lecture Notes',
        icon: '🎓',
        content: JSON.stringify({
            type: 'doc',
            content: [
                {
                    type: 'heading',
                    attrs: { level: 1 },
                    content: [{ type: 'text', text: 'Lecture Notes' }],
                },
                {
                    type: 'paragraph',
                    content: [
                        { type: 'text', text: 'Course: ', marks: [{ type: 'bold' }] },
                        { type: 'text', text: '[Course Name]' },
                    ],
                },
                {
                    type: 'paragraph',
                    content: [
                        { type: 'text', text: 'Date: ', marks: [{ type: 'bold' }] },
                        { type: 'text', text: new Date().toLocaleDateString() },
                    ],
                },
                {
                    type: 'paragraph',
                    content: [
                        { type: 'text', text: 'Topic: ', marks: [{ type: 'bold' }] },
                        { type: 'text', text: '[Lecture Topic]' },
                    ],
                },
                {
                    type: 'horizontalRule',
                },
                {
                    type: 'heading',
                    attrs: { level: 2 },
                    content: [{ type: 'text', text: 'Key Concepts' }],
                },
                {
                    type: 'bulletList',
                    content: [
                        {
                            type: 'listItem',
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Concept 1' }] }],
                        },
                        {
                            type: 'listItem',
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Concept 2' }] }],
                        },
                    ],
                },
                {
                    type: 'heading',
                    attrs: { level: 2 },
                    content: [{ type: 'text', text: 'Detailed Notes' }],
                },
                {
                    type: 'paragraph',
                },
                {
                    type: 'heading',
                    attrs: { level: 2 },
                    content: [{ type: 'text', text: 'Questions' }],
                },
                {
                    type: 'orderedList',
                    content: [
                        {
                            type: 'listItem',
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Question to review' }] }],
                        },
                    ],
                },
                {
                    type: 'heading',
                    attrs: { level: 2 },
                    content: [{ type: 'text', text: 'Summary' }],
                },
                {
                    type: 'blockquote',
                    content: [
                        {
                            type: 'paragraph',
                            content: [{ type: 'text', text: 'Key takeaways from this lecture...' }],
                        },
                    ],
                },
            ],
        }),
    },
];
