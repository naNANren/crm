package com.xxxx.crm.controller;

import com.xxxx.crm.base.BaseController;
import com.xxxx.crm.base.ResultInfo;
import com.xxxx.crm.query.RoleQuery;
import com.xxxx.crm.service.RoleService;
import com.xxxx.crm.vo.Role;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("role")
public class RoleController extends BaseController {
    @Resource
    private RoleService roleService;

    /**
     * 查询所有的角色列表
     * @return
     */
    @RequestMapping("queryAllRoles")
    @ResponseBody
    public List<Map<String,Object>> queryAllRoles(Integer userId){


        return roleService.queryAllRoles(userId);

    }


    /**
     * 分页查询角色列表
     * @param roleQuery
     * @return
     */
    @GetMapping("list")
    @ResponseBody
    public Map<String,Object> selectByParams(RoleQuery roleQuery){
    return roleService.queryByParamsForTable(roleQuery);
   }

    /**
     * 进入角色管理页面
     * @return
     */
    @RequestMapping("index")
   public String index(){
        return "role/role";
   }

  @PostMapping("add")
  @ResponseBody
   public ResultInfo addRole(Role role){
  roleService.addRole(role);
  return success("角色添加成功!");
   }

    /**
     * 进入添加/更新角色信息的页面
     * @return
     */
   @RequestMapping("toAddOrUpdateRolePage")
   public String toAddOrUpdateRolePage(Integer roleId,HttpServletRequest request){
       //如果roleId不为空,则表示修改操作,通过角色ID查询角色记录,存到请求域中
       if (roleId != null){
           //通过角色ID查询角色记录
           Role role=roleService.selectByPrimaryKey(roleId);
           //设置到请求域中
           request.setAttribute("role",role);
       }
        return "role/add_update";
   }


    @PostMapping("update")
    @ResponseBody
    public ResultInfo updateRole(Role role){
        roleService.updateRole(role);
        return success("角色修改成功!");
    }

    @PostMapping("delete")
    @ResponseBody
    public ResultInfo deleteRole(Integer roleId){
        roleService.deleteRole(roleId);
        return success("角色删除成功!");
    }

    /**
     * 角色授权
     * @param roleId
     * @param mIds
     * @return
     */
    @PostMapping("addGrant")
    @ResponseBody
    public ResultInfo addGrant(Integer roleId,Integer [] mIds){
        roleService.addGrant(roleId,mIds);
        return success("角色授权成功");
    }


}
