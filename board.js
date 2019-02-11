// Generate ID
function randomString() {
    var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
    var str = '';
    for (var i = 0; i < 10; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

//generate Template function
function generateTemplate(templatename, data, basicElement) {
    var template = document.getElementById(templatename).innerHTML;
    var element = document.createElement(basicElement || 'div');
    Mustache.parse(template);
    console.log('generatetemplatefunc', element);
    element.innerHTML = Mustache.render(template, data);
    console.log('generatetemplatefunc', element.innerHTML);
    return element;
}
// Column Class for Template
function Column(name) {
    var self = this;
    this.id = randomString();
    this.name = name;
    this.element = generateTemplate('column-template', {
        name: this.name,
        id: this.id
    });
    console.log(this.element);
    // Button for deleting the column
    this.element.querySelector('.column').addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-delete')) {
            self.removeColumn();
        }

        if (event.target.classList.contains('add-card')) {
            self.addCard(new Card(prompt("Enter the name of the card")));
        }
    });
}

// Methods for the column class (adding and removing)
Column.prototype = {
    addCard: function (card) {
        this.element.querySelector('ul').appendChild(card.element);
    },
    removeColumn: function () {
        this.element.parentNode.removeChild(this.element);
    }
};

// //Generate class Card
    function Card(description) {
        var self = this;

        this.id = randomString();
        this.description = description;
        this.element = generateTemplate('card-template', {
            description: this.description
        }, 'li');



        this.element.querySelector('.card').addEventListener('click', function (event) {
            event.stopPropagation();

            if (event.target.classList.contains('btn-delete')) {
                self.removeCard();
            }
        });
    }

    // Method for removing the card 
    Card.prototype = {
        removeCard: function () {
            this.element.parentNode.removeChild(this.element);
        }
    }

// let Inline = Quill.import('blots/inline');
let BlockEmbed = Quill.import('blots/block/embed');


class BoardBlot extends BlockEmbed {
    static create(value) {
        let node = super.create();
        var name = value.name;
        node.dataset.id = value.Bid;
        let ID = node.dataset.id ;
        var col = new Column(name);
        board.addColumn(col,node);
        return node;

    }

    // static value(domNode) {
    //     return domNode.dataset.id;
    
    // }
   
    // addColumn(col){
    //         domNode.appendChild(col.element);
        
        
    // }
    
}
BoardBlot.blotName = 'Board';
BoardBlot.tagName = 'div';
BoardBlot.className = 'board';


Quill.register(BoardBlot);

//Quill dependent properties
var options = {
    theme: 'snow',
    modules: {
        toolbar: {
            container: [['bold', 'italic'], ['custom-board']],
            handlers: {
                'custom-board': CustomBoardFunction

            }
        }
    }
}

//Quill declaration for editor

var container = document.getElementById('boardQuill');
var quill = new Quill(container, options);

//Button Board in Toolbar of Quill
var customButton = document.querySelector('.ql-custom-board');
customButton.innerHTML = 'Board';


// Generate object and pin to listening for events
var board = {
    name: 'Kanban Board',
    addColumn: function (col,node) {
        // console.log(col);
        // console.log('board.addcolumn ka this.element', this.element);
        // console.log('board.addcolumn', col.element);
        console.log(node);
    
       node.appendChild(col.element);

    },
    // element : document.querySelector('#Id')
   

    

};

function CustomBoardFunction(e) {
    let range = quill.getSelection(true);

    console.log('range', range);
    var name = prompt('Enter a column name');
    var Bid = randomString();
    
    // BoardBlot.addColumn(col);
    quill.insertText(range.index, '\n', Quill.sources.USER);
    quill.insertEmbed(range.index + 1, 'Board', { 'name': name,'Bid': Bid}, Quill.sources.USER);
    quill.setSelection(range.index + 2, Quill.sources.SILENT);
    
    // console.log('boardaddcolmn', board.element);

    




}


