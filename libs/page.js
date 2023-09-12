$(function(){
    var result = entries
    var laypage = null
    var form = null
    var curr = 1
    var total = entries.length
    var pageSize = 10

    $('#back').click(function(){
        location.href = 'index.html'
    })
    $('#search').click(function(){
        var value = $('#search_value').val()
        curr = 1
        if(value == ''){
            result = entries
            total = result.length
        }else{
            var tmpArr = entries.filter(r => {
                if(r['Title'].indexOf(value) > -1 || 
                   r['Climate change'].indexOf(value) > -1 || 
                   r['Cardiovascular Disease'].indexOf(value) > -1 ||
                   r['Comments|Finding'].indexOf(value) > -1
                ){
                    return r
                }
            })
            total = tmpArr.length
            result = tmpArr
        }
        pagnation()
        createTableHtml(result.slice((curr-1)*pageSize, curr * pageSize))
    })
    createTableHtml(result.slice((curr-1)*pageSize, curr * pageSize))
    showstat(curr, pageSize, total)
     /**
     * Layui 相关
     */
    layui.use(function(){
        laypage = layui.laypage;
        form = layui.form
        pagnation()
        form.on('select(showpage)', function (data) {
            pageSize = data.value
            pagnation()
        });
    });
    function pagnation(){
        laypage.render({
            elem: 'pagination',
            curr: curr,
            limit: pageSize,
            count: total,
            prev: false,
            next: false,
            jump: function(obj, first){
                curr = obj.curr
                createTableHtml(result.slice((curr-1)*pageSize, curr * pageSize))
                showstat(curr, pageSize, total)
            }
        });
    }
})

function showstat(curr, pageSize, total){
    $('#total').text(total)
    $('#curr').text(curr)
    $('#page-size').text(pageSize*curr)
}

function createTableHtml(data){
    var html = ''
    data.forEach(ele => {
        html += `
           <tr>
                <td>${ele['Enter ID']}</td>
                <td>${ele['Title']}</td>
                <td>${ele['Country|region']}</td>
                <td>${ele['Climate change']}</td>
                <td>${ele['Cardiovascular Disease']}</td>
                <td>${ele['Gender Disparity']}</td>
                <td>${ele['Gender Disparity Assessment']}</td>
                <td>${ele['Age Disparity']}</td>
                <td>${ele['Age Disparity Assessment']}</td>
                <td>${ele['Ethnicity|Race Study']}</td>
                <td>${ele['Ethnicity|Race Disparity Assessment']}</td>
                <td>${ele['Comments|Finding']}</td>
                <td>${ele['Source']}</td>
                <td>${ele['Enter By']}</td>
           </tr>
        `
    })
    $('#tbody').html(html)
}