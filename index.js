/**
*   Dependencias
**/
//en ECMAScript 2015
import $ from 'jquery';


$(function(){
    
    var shows = $('#body').find('.shows');
    var loader = shows.find('.loader');
    var template =  '<article class="show">' +
                        '<div class="foto"> ' +
                            '<img src=":foto:">' +
                        '</div>' +
                        '<div class="texto">' +                            
                            '<a class="titulo" href=":url:">:nombre:</a>'+
                            ':descripcion:' +
                            '<button class="like">Me Gusta</button>'+
                        '</div>' +
                    '</article>';

    shows.on('click', '.like', function(e){
        // console.log($(this));
        var $this = $(this);
        var $showActual = $this.closest('.show');
        $showActual.toggleClass("liked");
        if($showActual.hasClass("liked")){
            $this.animate({
                "font-size" : "1.3em"
            },100);    
        }
        else{
            $this.animate({
                "font-size" : "1em"
            },100);
        }        
    })

    //Para ocultar el Spinner
    function Spinner(oculto){
        if(oculto){
            loader.insertAfter(shows);
        }else{  
            loader.remove();
        }
    }


    //Para cargar un arreglo de shows 
    function cargarShows(arrayShows){        
        arrayShows.forEach(function(show){
            Spinner(false);    
            var articulo = template
                            .replace(':foto:',show.image ? show.image.medium : '')
                            .replace(':url:', show.url)
                            .replace(':nombre:', show.name)                                            
                            .replace(':descripcion:',show.summary);
            var $articulo = $(articulo);
            shows.append($articulo.fadeIn(4000));   
        });      
    }

    //Ulizando LocalStorage
    if(!localStorage.shows){
        //Consulta Ajax para traer todos los shows de la Api de TVMaze
        /*$.ajax({
            url:'https://api.tvmaze.com/shows',
            success: function(data, textStatus, xhr){                            
                cargarShows(data);                  
            }
        }); */
        
        
        //Utilizando promesas
        $.ajax({
            url: 'https://api.tvmaze.com/shows'
        })
        .then(function(data){   
            localStorage.shows = JSON.stringify(data);                         
            cargarShows(data);                  
        })
    }
    else{
        cargarShows(JSON.parse(localStorage.shows));
    }

        
    // Evento submit del formulario
    $('#body')
        .find('.search_form')
        .on('submit',function(event){
            event.preventDefault();  
            var criterioBusqueda = $(this).find('#txtSearch').val();            
            shows.find('.show').remove();
            // shows.empty();                 
            Spinner(true);
            
            //Consulta Ajax para traer shows segun criterio de busqueda de la Api de TVMaze
            /*$.ajax({
                url:'https://api.tvmaze.com/search/shows',
                data: {q: criterioBusqueda},
                success: function(respuesta, textStatus, xhr){                      
                    // console.log(respuesta);
                    // var arreglo = respuesta.map(function(arrayElement){
                    //     return arrayElement.show;
                    // })
                    // console.log(arreglo);
                    
                    cargarShows(respuesta.map(function(arrayElement){
                        return arrayElement.show;
                    })); 

                }
            });   */       
            
            //Utilizando Promesas      
            $.ajax({
                url:'https://api.tvmaze.com/search/shows',
                data: {q: criterioBusqueda}
            })
            .then(function(respuesta){
                
                // extrayendo primero el array
                 /*var array = respuesta.map(function(elementos){
                     return elementos.show;
                 })
                 cargarShows(array);*/

                //ejecutando todo junto
                cargarShows(respuesta.map(function(arrayElement){
                    return arrayElement.show;
                }));
            })
        });       
});




