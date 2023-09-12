var layer = null
$(function(){
    /**
     * Layui 相关
     */
    layui.use(function(){
        layer = layui.layer;
    });
    var chart = document.getElementById('chart')
    //处理源数据
    var chartDom = resourceHandle(resource, chart)
    $('#info').click(function(){
        layer.open({
            type: 1,
            area: ['80%', '500px'],
            title: false, 
            closeBtn: 0,
            shadeClose: true, 
            content: $('#info-layer')
        });
    })
    //切换语言
    $('#lang a').click(function(){
        $(this).addClass('on').siblings().removeClass('on')
        var lang = $(this).attr('lang')
        $('.lang_wrapper').hide()
        $('.lang_wrapper#' +lang).show()
    })
})
/**
 * 处理源数据
 */
function resourceHandle(arr, chartDom){
    var data = getData(arr)
    var group1 = getGroup(arr, 'Country|region', 'Climate change')
    var group2 = getGroup(arr, 'Climate change', 'Cardiovascular Disease')
    var group3 = getGroup3(arr, 'Cardiovascular Disease', 'Age Disparity Assessment', 'Age Disparity')
    var group4 = getGroup3(arr, 'Cardiovascular Disease', 'Gender Disparity Assessment', 'Gender Disparity')
    var group5 = getGroup3(arr, 'Cardiovascular Disease', 'Ethnicity|Race Disparity Assessment', 'Ethnicity|Race Study')
    var group6 = getGroup2(arr, 'Age Disparity Assessment', 'Significant Difference')
    var group7 = getGroup2(arr, 'Age Disparity Assessment', 'No Significant Difference')
    var group8 = getGroup2(arr, 'Gender Disparity Assessment', 'Significant Difference')
    var group9 = getGroup2(arr, 'Gender Disparity Assessment', 'No Significant Difference')
    var group10 = getGroup2(arr, 'Ethnicity|Race Disparity Assessment', 'Significant Difference')
    var group11 = getGroup2(arr, 'Ethnicity|Race Disparity Assessment', 'No Significant Difference')
    initChart(chartDom, data, [...group1, ...group2, ...group3, ...group4, ...group5, ...group6, ...group7, ...group8, ...group9, ...group10, ...group11])
}
/**
 * 转换组别
 */
function getGroup(arr, type1, type2){
    var group = {}
    arr.forEach(ele => {
        var t = ele[type1]
        if(!group[t]){
            group[t] = {}
        }
        var t1 = ele[type2]
        if(!group[t][t1]){
            group[t][t1] = []
        }
        group[t][t1].push(ele)
    })
    return getLinks(group)
}
/**
 * 转换组别
 */
function getGroup2(data, type1, type2){
    var obj = {}
    data.forEach(ele => {
        var cardi = ele['Cardiovascular Disease']
        if(!obj[cardi]){
            obj[cardi] = {
                'Gender Disparity Assessment': {
                    'Significant Difference': [],
                    'No Significant Difference': []
                },
                'Age Disparity Assessment': {
                    'Significant Difference': [],
                    'No Significant Difference': []
                },
                'Ethnicity|Race Disparity Assessment': {
                    'Significant Difference': [],
                    'No Significant Difference': []
                }
            }
        }
        if(ele['Gender Disparity'] == 'Yes' && ele['Gender Disparity Assessment'] == 'Significant Difference'){
            obj[cardi]['Gender Disparity Assessment']['Significant Difference'].push(ele)
        }
        if(ele['Gender Disparity'] == 'Yes' && ele['Gender Disparity Assessment'] == 'No Significant Difference'){
            obj[cardi]['Gender Disparity Assessment']['No Significant Difference'].push(ele)
        }
        if(ele['Age Disparity'] == 'Yes' && ele['Age Disparity Assessment'] == 'Significant Difference'){
            obj[cardi]['Age Disparity Assessment']['Significant Difference'].push(ele)
        }
        if(ele['Age Disparity'] == 'Yes' && ele['Age Disparity Assessment'] == 'No Significant Difference'){
            obj[cardi]['Age Disparity Assessment']['No Significant Difference'].push(ele)
        }
        if(ele['Ethnicity|Race Study'] == 'Yes' && ele['Ethnicity|Race Disparity Assessment'] == 'Significant Difference'){
            obj[cardi]['Ethnicity|Race Disparity Assessment']['Significant Difference'].push(ele)
        }
        if(ele['Ethnicity|Race Study'] == 'Yes' && ele['Ethnicity|Race Disparity Assessment'] == 'No Significant Difference'){
            obj[cardi]['Ethnicity|Race Disparity Assessment']['No Significant Difference'].push(ele)
        }
    })
    var links = []
    for(var key in obj){
        var ele = obj[key]
        if(type2){
            if(ele[type1][type2].length > 0){
                links.push({source: type1, target: type2, value: ele[type1][type2].length, data: ele[type1][type2]})
            }
        }else{
            links.push({source: key, target: type1, value: 1, data: ele})
        }
    }
    return links
}
function getGroup3(arr, type1, type2, type3){
    var obj = {}
    arr.forEach((ele) => {
        var t = ele[type1]
        if(!obj[t]){
            obj[t] = {
                'Gender Disparity': [],
                'Age Disparity': [],
                'Ethnicity|Race Study': []
            }
        }  
        if(ele['Gender Disparity'] == 'Yes'){
            obj[t]['Gender Disparity'].push(ele)
        }
        if(ele['Age Disparity'] == 'Yes'){
            obj[t]['Age Disparity'].push(ele)
        }
        if(ele['Ethnicity|Race Study'] == 'Yes'){
            obj[t]['Ethnicity|Race Study'].push(ele)
        }
    })
    var links = []
    for(var key in obj){
        var ele = obj[key]
        if(ele[type3].length > 0){
            links.push({source: key, target: type2, value: ele[type3].length, data: ele[type3]})
        }
    }
    return links
}
/**
 * 生成data数据
 */
function getData(res){
    var data = []
    res.forEach(ele => {
        data.push(ele['Country|region'])
        data.push(ele['Climate change'])
        data.push(ele['Cardiovascular Disease'])
    })
    var tmpArr = [
        'Gender Disparity Assessment', 
        // 'Age Disparity', 
        'Age Disparity Assessment', 
        // 'Ethnicity|Race Study', 
        'Ethnicity|Race Disparity Assessment',
        'Significant Difference',
        'No Significant Difference',
        // 'Not Applicable',
        // 'Yes',
        // 'No'
    ]
    var arr = Array.from(new Set([...data, ...tmpArr]))
    return arr.map(name => {
        var obj = {name}
        return obj
    })
}
/**
 * 生成links数据
 */
function getLinks(group, type){
    var links = []
    for(var key in group){
        var ele = group[key]
        var keys = Object.keys(ele)
        var obj = {source: key, target: '', value: 0}
        keys.forEach($key => {
            if(group[key][$key].length > 0){
                var obj = {source: key, target: type ? type : $key, value: group[key][$key].length, data: group[key][$key]}
                links.push(obj)
            }
        })
    }
    return links
}
/**
 * 初始化表格
 */
function initChart(chartDom, data, links){
    var chart = echarts.init(chartDom);
    var option = option = {
        series: {
            type: 'sankey',
            layout: 'none',
            emphasis: {
              focus: 'adjacency'
            },
            align: 'top',
            nodeAlign: 'left',
            data,
            links,
            lineStyle: {
                color: 'source',
                curveness: 0.5
            },
            label: {
                color: 'rgba(0,0,0,0.7)',
                fontFamily: 'Arial',
                fontSize: 10
            }
        }
    };
    chart.setOption(option);      
    chart.on('click', function (params) {
        console.log(params)
        var html = ''
        var data = params.data.data
        if(data){
            html += '<div class="chart_detail">'
            data.forEach(ele => {
                html += '<div class="chart_label">'
                   html += '<div class="chart_item"><span>Title</span><strong>'+ele.Title+'</strong></div>'
                   html += '<div class="chart_item"><span>Source</span><strong>'+ele['Source']+'</strong></div>'
                   html += '<div class="chart_item"><span>Country/region</span><strong>'+ele['Country|region']+'</strong></div>'
                   html += '<div class="chart_item"><span>Climate change</span><strong>'+ele['Climate change']+'</strong></div>'
                   html += '<div class="chart_item"><span>Cardiovascular Disease</span><strong>'+ele['Cardiovascular Disease']+'</strong></div>'
                   html += '<div class="chart_item"><span>Gender Disparity</span><strong>'+ele['Gender Disparity']+'</strong></div>'
                   html += '<div class="chart_item"><span>Age Disparity</span><strong>'+ele['Age Disparity']+'</strong></div>'
                   html += '<div class="chart_item"><span>Age Disparity Assessment</span><strong>'+ele['Age Disparity Assessment']+'</strong></div>'
                   html += '<div class="chart_item"><span>Ethnicity/Race Study</span><strong>'+ele['Ethnicity|Race Study']+'</strong></div>'
                   html += '<div class="chart_item"><span>Ethnicity/Race Disparity Assessment</span><strong>'+ele['Ethnicity|Race Disparity Assessment']+'</strong></div>'
                   html += '<div class="chart_item"><span>Comments/Finding</span><strong>'+ele['Comments|Finding']+'</strong></div>'
                   html += '<div class="chart_item bt"><span>Enter By</span><strong>'+ele['Enter By']+'</strong></div>'
                html += '</div>'
            })
            html += '</div>'
            layer.open({
                type: 1,
                area: ['80%', '600px'],
                title: false, 
                closeBtn: 1,
                shadeClose: true, 
                content: html
            });
        }
    });
}