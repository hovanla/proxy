$(document).ready(function(){
    // function generateUUID(){
    //     var d = new Date().getTime();
        
    //     if( window.performance && typeof window.performance.now === "function" )
    //     {
    //         d += performance.now();
    //     }
        
    //     var uuid = 'xxxxxxxx4xxxyxxxxxxx'.replace(/[xy]/g, function(c)
    //     {
    //         var r = (d + Math.random()*16)%16 | 0;
    //         d = Math.floor(d/16);
    //         return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    //     });

    //     return uuid;
    // }
    function generateUUID() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
    $('#Add').click(function(){
      
        // $(".madd").text("Add");
        // $("input[name='namef']").val("");
        // $("#addFilterr").val("Add")
        let apikey=generateUUID();
        let idrow=apikey;
       
        let rowtb=`<tr id="${apikey}">
        <td>
            <span class="custom-checkbox">
            <input type="checkbox"  name="options[]" value="${apikey}">
            <label for="checkbox1"></label>
            </span>
        </td>
        <td class="apikey"><input name="apikey" type="text" value="${apikey}"></td>
        <td class="name"><input name="name" type="text"></td>
        <td class="use">0</td>
        <td class="limit"><input type="number" min="0" max="10000"></td>
        <td class="mb"><input type="number" min="0" max="10000"></td>
        <td>
            <a href="javascript:function() { return false; }" class="save" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="" data-original-title="Edit">save
            </i></a>
            <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="" data-original-title="Delete"></i></a>
        </td>
    </tr>
    <tr> <td></td><th colspan="7"> <span class="cnote">Note: </span> <input class="note" type="text"></th> </tr>
    `;
     $("tbody").prepend(rowtb);
     $("#"+idrow+" .name input").css('border','double');
     $("#"+idrow+" .apikey input").css('border','double');
     $("#"+idrow).next().find('.note').css('border','double');
     $("#"+idrow+" .limit input").css('border','double');
     $("#"+idrow+" .mb input").css('border','double');
     $("#"+idrow+" .name input").focus(); 
    });
    $('#addFilterr').click(function(){
        let id=$("#ab").data("id");
        let name=$("input[name='namef']").val();
        let namebt=$(this).val();
        let dt={
            "name":name
        };
        if(namebt=="Add"){
            $.ajax({
                method: "POST",
                url: "/insert",
                data:dt
            }).done(function( msg ) {
                let rowtb=`<tr id="${msg.id}">
                    <td>
                        <span class="custom-checkbox">
                        <input type="checkbox" name="options[]" value="${msg.id}">
                        <label for="checkbox1"></label>
                        </span>
                    </td>
                    <td>${msg.id}</td>
                    <td class="name"><a href="/filter/${msg.id}"> ${name}</a></td>
                    <td>
                        <a href="#" class="editt" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="" data-original-title="Edit">&#xe3c9</i></a>
                        <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="" data-original-title="Delete">&#xE872;</i></a>
                    </td>
                </tr>`;
                 $("tbody").append(rowtb);
                $('#addfilter').modal('hide');
            });
        }else{
            $.ajax({
                method: "PUT",
                url: "/update/"+id,
                data:dt
            }).done(function( msg ) {
                $("#"+id+" .name").text(name);
                $('#addfilter').modal('hide');
            });
        }
        
    });
    $('#tbfilter').on('click', '.update', function() {
        $(this).removeClass("update").addClass("editt");
        $(this).find("i").text("edit")
        let idrow=$(this).closest('tr').attr('id');
        $("#"+idrow).next().find('.note').attr('readonly',true);
        $("#"+idrow).next().find('.note').css('border','none');
        $("#"+idrow+" .limit input").attr("readonly", true); 
        $("#"+idrow+" .limit input").css('border','none');
        $("#"+idrow+" .mb input").css('border','none');
        $("#"+idrow+" .mb input").attr("readonly", true); 
        $("#"+idrow+" .name input").attr("readonly", true); 
        $("#"+idrow+" .name input").css('border','none');
        $("#"+idrow+" .apikey input").css('border','none');
        $("#"+idrow+" .apikey input").attr("readonly", true); 
        let username=$(".username").text();
        let name=$("#"+idrow+" .name input").val();
        let limitm=$("#"+idrow+" .limit input").val();
        let apikey=$("#"+idrow+" .apikey input").val();
        let apikey_old=$("#"+idrow+" .custom-checkbox input").val();
        let limitu=$("#"+idrow+" .mb input").val();
        let note=$("#"+idrow).next().find('.note').val();
        const nDate = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh'
          });
        var myDate = Date.parse(nDate);
        let dt={
            "apikey":apikey.trim(),
            "name":name,
            "limitm":limitm,
            "limitu":Number(limitu),
            "updateat":myDate,
            "modifyby":username,
            "note":note
        };
        $.ajax({
            method: "put",
            url: "/api/update/"+apikey_old,
            data:dt
            }).done(function( msg ) {
                console.log(msg.status)
            });

    });
    $('#tbfilter').on('click', '.save', function() {
        let thiss = $(this)
        let idrow=$(this).closest('tr').attr('id');
        let name=$("#"+idrow+" .name input").val();
        let apikey=$("#"+idrow+" .apikey input").val();
        let limitm=$("#"+idrow+" .limit input").val();
        let limitu=$("#"+idrow+" .mb input").val();
        let username=$(".username").text();
        let note=$("#"+idrow).next().find('.note').val();
        let todaysDate =new Date(); 
        const nDate = todaysDate.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh'
          });
        // let year='"'+todaysDate.getFullYear()+'"';
        let year=todaysDate.getFullYear();
         let usem={
            [year]:{"0A":0,"1A":0,"2A":0,"3A":0,"4A":0,"5A":0,"6A":0,"7A":0,"8A":0,"9A":0,"10A":0,"11A":0}
         }
        var myDate = Date.parse(nDate);
        if(apikey.trim().length===0){
            alert("Api_key input please!")
            $("#"+idrow+" .apikey input").focus();
            return;
        }
        let dt={
            "apikey":apikey.trim(),
            "name":name,
            "use":0,
            "usem":usem,
            "limitm":limitm,
            "limitu":limitu,
            "createdat":myDate,
            "createby":username,
            "rfalse":0,
            "note":note
        };
        $.ajax({
            method: "post",
            url: "/api/insert",
            data:dt
            }).done(function( msg ) {
                console.log(msg.status)
                if(msg.error){
                    alert(msg.error)
                }else{
                    $("#"+idrow).next().find('.note').attr('readonly',true);
                    $("#"+idrow).next().find('.note').css('border','none');
                    $("#"+idrow+" .limit input").attr("readonly", true); 
                    $("#"+idrow+" .limit input").css('border','none');
                    $("#"+idrow+" .mb input").css('border','none');
                    $("#"+idrow+" .mb input").attr("readonly", true); 
                    $("#"+idrow+" .name input").attr("readonly", true); 
                    $("#"+idrow+" .name input").css('border','none');
                    $("#"+idrow+" .custom-checkbox input").val(apikey.trim());
                    $("#"+idrow+" .apikey input").css('border','none');
                    $("#"+idrow+" .apikey input").attr("readonly", true); 
                    thiss.removeClass("save").addClass("editt");
                    thiss.find("i").text("edit")

                }
                $('#deleteEmployeeModal').modal('hide');
            });
    });
    $('#tbfilter').on('click', '.editt', function() {
       $(this).find("i").text("save")
        $(this).removeClass("editt").addClass("update");
        let idrow=$(this).closest('tr').attr('id');
        $("#"+idrow).next().find('.note').attr('readonly',false);
        $("#"+idrow).next().find('.note').css('border','double');
        $("#"+idrow+" .limit input").attr("readonly", false); 
        $("#"+idrow+" .name input").css('border','double');
        $("#"+idrow+" .limit input").css('border','double');
        $("#"+idrow+" .mb input").css('border','double');
        $("#"+idrow+" .mb input").attr("readonly", false); 
        $("#"+idrow+" .name input").focus(); 
        $("#"+idrow+" .name input").attr("readonly", false); 
        $("#"+idrow+" .apikey input").attr("readonly", false); 
        $("#"+idrow+" .apikey input").css('border','double');
    });
	$('#tbfilter').on('click', '.delete', function() {
		$('.remove').attr("data-id","only");
		// var ID =$(this).closest('tr').attr('id');
        let idrow=$(this).closest('tr').attr('id');
        let apikey=$("#"+idrow+" .apikey input").val();
		$("#ab").data("id",apikey)
	
    });
    $('#DeleteAll').click(function(){
		$('.remove').attr("data-id","all");
    });
    $('.remove').click(function(){
        var chkb = $("input[name='options[]']:checked").map(function(){return $(this).val();}).get();
        if($('.remove').attr("data-id")=="all"){
			if(chkb.length>0){
				for(l in chkb){
                    $('#tbfilter tr#'+chkb[l]).next().remove();
					$('#tbfilter tr#'+chkb[l]).remove();
					$.ajax({
					method: "DELETE",
					url: "/api/delete/"+chkb[l],
					}).done(function( msg ) {
						$('#deleteEmployeeModal').modal('hide');
					});
				}
			}else{
				alert("You have not selected any item!")
			}
		}else{
            $('#tbfilter tr#'+$("#ab").data("id")).next().remove();
            $('#tbfilter tr#'+$("#ab").data("id")).remove();
            console.log($("#ab").data("id"))
			$.ajax({
				method: "DELETE",
				url: "api/delete/"+$("#ab").data("id"),
				}).done(function( msg ) {
					$('#deleteEmployeeModal').modal('hide');
				});
		}
    })
    $('[data-toggle="tooltip"]').tooltip();
    var checkbox = $('table tbody input[type="checkbox"]');
	$("#selectAll").click(function(){
		$('input:checkbox').not(this).prop('checked', this.checked);
	});
	
	checkbox.click(function(){
		if(!this.checked){
			$("#selectAll").prop("checked", false);
		}
	});
});