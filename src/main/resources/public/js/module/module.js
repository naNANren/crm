layui.use(['table', 'treetable'], function () {
    var $ = layui.jquery,
        table = layui.table,
        treeTable = layui.treetable;
    // 渲染表格
      treeTable.render({
        treeColIndex: 1,
        treeSpid: -1,
        treeIdName: 'id',
        treePidName: 'parentId',
        elem: '#munu-table',
        url: ctx+'/module/list',
        toolbar: "#toolbarDemo",
        treeDefaultClose:true,
        page: true,
        cols: [[
            {type: 'numbers'},
            {field: 'moduleName', minWidth: 100, title: '菜单名称'},
            {field: 'optValue', title: '权限码'},
            {field: 'url', title: '菜单url'},
            {field: 'createDate', title: '创建时间'},
            {field: 'updateDate', title: '更新时间'},
            {
                field: 'grade', width: 80, align: 'center', templet: function (d) {
                    if (d.grade == 0) {
                        return '<span class="layui-badge layui-bg-blue">目录</span>';
                    }
                    if(d.grade==1){
                        return '<span class="layui-badge-rim">菜单</span>';
                    }
                    if (d.grade == 2) {
                        return '<span class="layui-badge layui-bg-gray">按钮</span>';
                    }
                }, title: '类型'
            },
            {templet: '#auth-state', width: 180, align: 'center', title: '操作'}
        ]],
        done: function () {
            layer.closeAll('loading');
        }
    });

    // 监听头部工具栏事件
    table.on('toolbar(munu-table)',function (data) {
        switch (data.event) {
            //添加目录  层级=0 父菜单=-1
            case "add":
                openAddModuleDialog(0,-1);
                break;
            case "expand"://全部展开
                treeTable.expandAll('#munu-table');
                break;
            case "fold"://全部折叠
                treeTable.foldAll('#munu-table');
                break;
        }
    });

  //监听行工具栏
    table.on('tool(munu-table)',function (data) {
        var layEvent =data.event;
        if(layEvent === "add"){
            if(data.data.grade==2){
                layer.msg("暂不支持四级菜单添加操作!",{icon:5});
                return;
            }
            openAddModuleDialog(data.data.grade+1,data.data.id);
        }else if(layEvent === "edit"){
            openUpdateModuleDialog(data.data.id);
        }else if(layEvent === "del"){
            layer.confirm("确认删除当前记录?",{icon: 3, title: "菜单管理"},function (index) {
                $.post(ctx+"/module/delete",{id:data.data.id},function (data) {
                    if(data.code==200){
                        layer.msg("删除成功",{icon:6});
                        window.location.reload();
                    }else{
                        layer.msg(data.msg,{icon:5});
                    }
                })
            })
        }
    });

   //打开添加资源的对话框
    function openAddModuleDialog(grade,parentId) {
        layui.layer.open({
            title:"<h3>资源管理-添加资源<h3>",
            type:2,
            area:["700px","500px"],
            maxmin:true,
            content:ctx+"/module/toAddModulePage?grade="+grade+"&parentId="+parentId
        })
    }

  //打开修改资源的对话框
    function openUpdateModuleDialog(id) {
        layui.layer.open({
            title:"<h3>资源管理-修改资源<h3>",
            type:2,
            area:["700px","500px"],
            maxmin:true,
            content:ctx+"/module/toUpdateModulePage?id="+id
        })
    }




});