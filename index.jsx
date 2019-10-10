import { render } from 'react-dom';
import App from 'Components/App';

//const store = configureStore();
let root;
const init = () => {
    render(<App />, document.getElementById('container'), root);
};

init();
