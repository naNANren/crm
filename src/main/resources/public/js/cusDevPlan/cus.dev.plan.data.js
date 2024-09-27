layui.use(['table','layer'],function() {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;
    //计划项数据展示
    var tableIns = table.render({
        elem: '#cusDevPlanList',
        url: ctx + '/cus_dev_plan/list?saleChanceId=' + $("[name='id']").val(),
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limits: [10, 15, 20, 25],
        limit: 10,
        toolbar: "#toolbarDemo",
        id: "cusDevPlanListTable",
        cols: [[
            {type: "checkbox", fixed: "center"},
            {field: "id", title: '编号', fixed: "true"},
            {field: 'planItem', title: '计划项', align: "center"},
            {field: 'exeAffect', title: '执行效果', align: "center"},
            {field: 'planDate', title: '执行时间', align: "center"},
            {field: 'createDate', title: '创建时间', align: "center"},
            {field: 'updateDate', title: '更新时间', align: "center"},
            {title: '操作', fixed: "right", align: "center", minWidth: 150, templet: "#cusDevPlanListBar"}
        ]]
    });


    //头工具栏事件
    table.on('toolbar(cusDevPlans)', function (data) {
        switch (data.event) {
            case "add"://添加计划项
                openAddOrUpdateCusDevPlanDialog();
                break;
            case "success"://开发成功
                updateSaleChanceDevResult(2);
                break;
            case "failed"://开发失败
                updateSaleChanceDevResult(3);
                break;
        }
        ;
    });


    /**
     * 行监听
     */
    table.on("tool(cusDevPlans)", function (data) {//更新计划项
        if (data.event === "edit") {
            openAddOrUpdateCusDevPlanDialog(data.data.id);
        } else if (data.event === "del") {//删除计划项

            //删除计划项
            deleteCusDevPlan(data.data.id);
        }

    });


    // 打开添加或修改计划项数据页面
    function openAddOrUpdateCusDevPlanDialog(id) {
        var url = ctx + "/cus_dev_plan/toAddOrUpdateCusDevPlanPage?sId=" + $("[name='id']").val();
        var title = "计划项管理-添加计划项";
        if (id != null && id != '') {
            url += "&id=" + id;
            title = "计划项管理-更新计划项";
        }
        layui.layer.open({
            title: title,
            type: 2,
            area: ["500px", "300px"],
            maxmin: true,
            content: url
        });
    }


    /**
     * 删除计划项
     */
    function deleteCusDevPlan(id) {
        //弹出确认框,询问用户是否确认删除
        layer.confirm('您确认要删除该记录吗?', {icon: 3, title: '开发项数据管理'}, function (index) {
            //发送ajax请求,执行删除操作
            $.post(ctx + '/cus_dev_plan/delete', {id: id}, function (result) {
                //判断删除结构
                if (result.code == 200) {
                    layer.msg("删除成功", {icon: 6});
                    //刷新数据表格
                    tableIns.reload();
                } else {
                    //提示失败原因
                    layer.msg(result.msg, {icon: 5});
                }
            });

        });
    }


    //更新营销机会的开发状态
    function updateSaleChanceDevResult(devResult) {
        //弹出确认框,询问用户是否确认删除
        layer.confirm('您确定执行当前操作？', {icon: 3, title: "营销机会管理"}, function (index) {
            //得到需要被更新的营销机会的ID(通过隐藏域获取)
            var sId = $("[name='id']").val();
            //发送ajax请求,更新营销机会的开发状态
            $.post(ctx + '/sale_chance/updateSaleChanceDevResult', {id: sId, devResult: devResult}, function (result) {
                if (result.code == 200) {
                    layer.msg("更新成功", {icon: 5});
                    //关闭窗口
                    layer.closeAll("iframe")
                    //刷新父页面
                    parent.location.reload();
                } else {
                    layer.msg(result.msg, {icon: 5});
                }

            });
        });
    }
});
