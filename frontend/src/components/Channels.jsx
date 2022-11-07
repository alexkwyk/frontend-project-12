import { useSelector, useDispatch } from 'react-redux';
import {
  Nav,
  Button,
} from 'react-bootstrap';
import { selectors as channelsSelectors, setCurrentChannelId } from '../slices/channelsSlice.js';

const Channels = () => {
  const dispatch = useDispatch();

  const changeChannel = (id) => () => dispatch(setCurrentChannelId(id));

  const channels = useSelector(channelsSelectors.selectAll);

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  return (
    <Nav variant="pills" defaultActiveKey="1" className="flex-column">
      <span className="py-4 px-3">Каналы</span>
      {channels.map((item) => (
        <Nav.Item as="li" key={item.id}>
          <Button
            type="button"
            variant={item.id === currentChannelId ? 'primary' : ''}
            className="border-0 w-100 rounded-0 text-start"
            onClick={changeChannel(item.id)}
          >
            <span className="p-2">#</span>
            {item.name}
          </Button>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Channels;
