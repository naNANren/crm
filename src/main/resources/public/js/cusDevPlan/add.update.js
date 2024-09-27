layui.use(['form', 'layer'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;


    /**
     *表单Submit监听
     */
    form.on('submit(addOrUpdateCusDevPlan)',function (data){
        var index= top.layer.msg("数据提交中,请稍后...",{icon:16,
            time:false,
            shade:0.8});
       //得到所有的表单元素的值
       var formData=data.field;

       //请求的地址
        var url=ctx+ "/cus_dev_plan/add"
        //判断计划项ID是否为空 (如果不为空,则表示更新)
        if($('[name="id"]').val()){
            url=ctx + "/cus_dev_plan/update";
        }

        $.post(url,formData,function (result) {
            if(result.code==200){
                layer.msg("操作成功",{icon: 6});
                //关闭加载层
                top.layer.close(index);
                //关闭弹出层
                top.layer.closeAll("iframe");
                // 刷新父页面,重新加载数据
                parent.location.reload();
            }else{
                layer.msg(result.msg,{icon:5});
            }

        });
        return false;
    });

    /**
     * 关闭当前弹出层
     */
    $("#closeBtn").click(function (){
        //当你在iframe页面关闭自身时
        var index=parent.layer.getFrameIndex(window.name);//先得到当前iframe层的索引
        parent.layer.close(index);  //再执行关闭
    });
    });





