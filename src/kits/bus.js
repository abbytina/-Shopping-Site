// 全局事件总线(global event bus)

// 导入Vue
import Vue from 'Vue';

// 实例化一个空的Vm对象导出
export var vm = new Vue();

//$on()和 $emit() 共同使用的key（事件名称）
export var KEY = "sendmsg";