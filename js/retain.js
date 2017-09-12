$(function(){

    var model = {
        init: function() {
            // if "notes" is not present il local storage, it initialises it
            if (!localStorage.notes) {
                localStorage.notes = JSON.stringify([]);
            }
        },
        add: function(obj) {
            // adds the passed obj to the local storage "notes"
            var data = JSON.parse(localStorage.notes);
            data.push(obj);
            localStorage.notes = JSON.stringify(data);
        },
        getAllNotes: function() {
            // retrieves the "notes" from localstorage in JSON format
            return JSON.parse(localStorage.notes);
        },
        delete: function(id) {
            // deletes a note
            var data = JSON.parse(localStorage.notes);
            // I don't like it, but since octopus.getNotes reverses the notes array, 
            // before deleting I need to reverse the storage notes 
            // and then re-reverse it in order to achieve correct functionality            
            data.reverse().splice(id, 1);
            localStorage.notes = JSON.stringify(data.reverse());
        }
    };


    var octopus = {
        
        addNewNote: function(noteStr) {
            var d = new Date();
            model.add({
                content: noteStr,
                date: d.toISOString().slice(0,10) + " " + d.toISOString().slice(11, 19)
            });
            view.render();
        },

        deleteNote: function(id) {
            model.delete(id);
            view.render();
        },

        getNotes: function() {
            // I don't like the reverse here... it makes the deleteNote difficult (see model.delete)
            return model.getAllNotes().reverse();
        },

        init: function() {
            model.init();
            view.init();
        }
    };


    var view = {
        init: function() {
            this.noteList = $('#notes');
            var newNoteForm = $('#new-note-form');
            var newNoteContent = $('#new-note-content');
            // event listener for form submissions
            newNoteForm.submit(function(e){
                octopus.addNewNote(newNoteContent.val());
                newNoteContent.val('');
                e.preventDefault();
            });
            // event listener for notes deletion
            this.noteList.on("click", 'div.note-close', function(el) {
                console.log('clicked on ' + this.id );
                octopus.deleteNote(this.id.substr(-1));
            });
            view.render();
        },

        render: function(){
            var htmlStr = '';
            // builds html for each element in "notes"
            octopus.getNotes().forEach(function(note, id){
                htmlStr += '<li id=' + id + ' class="note">' +
                        '<div class="note-close" id="cn'+id+'" title="delete note"></div>' + 
                        note.content +
                        '<span class="note-date">' + note.date + '</span>' +
                        
                    '</li>';
            });
            this.noteList.html( htmlStr );
        }
    };

    octopus.init();
});