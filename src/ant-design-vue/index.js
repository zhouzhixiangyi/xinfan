import { Button, Form, Input, Layout, Menu, Table, Breadcrumb, Select, DatePicker, Switch, List, Upload, Divider,ConfigProvider, Popconfirm} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';



const components = [
    Form,
    Button,
    Input,
    Layout,
    Menu,
    Table,
    Breadcrumb,
    Select,
    DatePicker,
    Switch,
    Select,
    List,
    Upload,
    Divider,
    ConfigProvider,
    Popconfirm
]

export function setupAntd(app) {
    components.forEach(component => {
        app.use(component)
    })
}

// export function setupAntd(app) {
//     app.use(Button);
//     app.use(Form);
//     app.use(Input);
// }