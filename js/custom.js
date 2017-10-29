(function ( $ ) {

    $.videoCall = function( callerId,roomId ) {
        var connection = new RTCMultiConnection();
        var streamId = '';
        caller = '';
        
        // this line is VERY_important
        connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
        
        // if you want audio+video conferencing
        connection.session = {
            audio: true,
            video: true
        };
        
        
        connection.local = document.getElementById('videos-local');
        connection.videosContainer = document.getElementById('videos-remote');
        connection.videosMultiContainer = document.getElementById('videos-remote-multi');
        
        function localVideo(event){
            streamId = event.streamid;
            var mediaElement = getMediaElement(event.mediaElement, {
                title: event.userid,
                buttons: ['stop','mute-audio','mute-video'],
                width: 100,
                showOnMouseEnter: false
            });
            
            connection.local.appendChild(mediaElement)
            
        
            setTimeout(function() {
                mediaElement.media.play();
            }, 5000);
            mediaElement.id = event.streamid;
        
        }
        
        function remoteMultiVideo(event){
            
            var mediaElement = getMediaElement(event.mediaElement, {
                title: event.userid,
                buttons: ['stop','mute-audio'],
                width: 100,
                showOnMouseEnter: true
            });
        
            connection.videosMultiContainer.appendChild(mediaElement);
            
        
            setTimeout(function() {
                mediaElement.media.play();
            }, 5000);
            mediaElement.id = event.streamid;
        }
        
        function remoteVideo(event){
            
            var mediaElement = getMediaElement(event.mediaElement, {
                title: event.userid,
                buttons: ['stop','mute-audio'],
                width: 100,
                showOnMouseEnter: false,
                class:'main'
            });
            // mediaElement.addClass('main');
            connection.videosMultiContainer.appendChild(mediaElement);
            
        
            setTimeout(function() {
                mediaElement.media.play();
            }, 5000);
            mediaElement.id = event.streamid;
        }
        
        
        connection.onstream = function(event) {
            
            if (event.type == 'local') {
                localVideo(event);
                return;
            } else {
                
                var totalViewers = connection.getAllParticipants().length;
                
                $('#views').html(' '+totalViewers);
                var numberOfUsers = document.querySelectorAll('.media-container').length;
                
                if (numberOfUsers == 1) {
                    remoteVideo(event);
                } else {
                    remoteMultiVideo(event);
                }
                
            }
        
        };
        
        connection.onleave = function(event) {
            var totalViewers = connection.getAllParticipants().length;
            $('#views').html(' '+totalViewers);
        };
        
        connection.userid = callerId;
        connection.openOrJoin(roomId);
        
        
        // Local user buttons
        
        $('#lVolume').on('click',function(){
            if($(this).attr('class') === 'fa fa-volume-off'){
                connection.attachStreams.forEach(function(stream) { stream.unmute('audio'); });
            } else {
                connection.attachStreams.forEach(function(stream) { stream.mute('audio'); });
            }    
           $(this).toggleClass('fa-volume-up fa-volume-off');
        });
        
        $('#lMirco').on('click',function(){
          if($(this).attr('class') === 'fa fa-microphone-slash'){
            connection.streamEvents[streamId].stream.unmute('audio');
          } else {
            connection.streamEvents[streamId].stream.mute('audio');   
          }        
           $(this).toggleClass('fa-microphone fa-microphone-slash');
        });
        
        $('#lCamera').on('click',function(){
          
          if($(this).attr('class') === 'fa fa-video-camera-slash'){
            connection.streamEvents[streamId].stream.unmute('video');
          } else {
            connection.streamEvents[streamId].stream.mute('video');   
          }    
          
          $(this).toggleClass('fa-video-camera fa-video-camera-slash');
        
        });    
        
        $('#lStop').on('click',function(){

            // stop all local cameras
            connection.attachStreams.forEach(function(localStream) {
                localStream.stop();
            });
        
            // close socket.io connection
            connection.close();
            
        });   
        
        $('#videos-remote-multi').on('click','.media-container',function(){
            $('#videos-remote-multi .media-container.main').removeClass('main');
            $(this).addClass('main');
        });
    }

}( jQuery ));
