import type { App } from 'vue'
import {
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElSwitch,
  ElPagination
} from 'element-plus'
import 'element-plus/dist/index.css'
const cpns = [ElButton, ElInput, ElSelect, ElOption, ElSwitch, ElPagination]
export default function (app: App): void {
  cpns.forEach(item => {
    app.component(item.name, item)
  })
}
