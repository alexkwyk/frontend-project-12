import { useSelector, useDispatch } from 'react-redux';
import {
  Nav,
  Button,
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { selectors as channelsSelectors, setCurrentChannelId } from '../slices/channelsSlice.js';
import { openModal } from '../slices/modalSlice.js';

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const changeChannel = ({ id }) => () => dispatch(setCurrentChannelId(id));
  const addChannel = () => dispatch(openModal({ type: 'adding' }));
  const removeChannel = ({ id }) => () => dispatch(openModal({ type: 'removing', target: { id } }));
  const renameChannel = ({ id, name }) => () => dispatch(openModal({ type: 'renaming', target: { id, name } }));

  const channels = useSelector(channelsSelectors.selectAll);

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  return (
    <Nav variant="pills" defaultActiveKey="1" className="flex-column">
      <div className="d-flex justify-content-between py-4 px-3">
        <span>{t('channels.title')}</span>
        <Button
          variant="outline-primary"
          className="py-0 px-1"
          onClick={addChannel}
        >
          +
        </Button>
      </div>
      {channels.map((item) => (
        <Nav.Item as="li" key={item.id} className="w-100">
          {item.removable ? (
            <Dropdown as={ButtonGroup} className="d-flex">
              <Button
                type="button"
                variant={item.id === currentChannelId ? 'primary' : ''}
                className="border-0 w-100 rounded-0 text-start text-truncate"
                onClick={changeChannel(item)}
              >
                <span className="p-2">#</span>
                {item.name}
              </Button>
              <Dropdown.Toggle
                split
                variant={item.id === currentChannelId ? 'primary' : ''}
                id="dropdown-split-basic"
              >
                <span className="visually-hidden">{t('channels.menuText')}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={removeChannel(item)}
                >
                  {t('channels.delete')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={renameChannel(item)}
                >
                  {t('channels.rename')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

          )
            : (
              <Button
                type="button"
                variant={item.id === currentChannelId ? 'primary' : ''}
                className="border-0 w-100 rounded-0 text-start"
                onClick={changeChannel(item)}
                key={item.id}
              >
                <span className="p-2">#</span>
                {item.name}
              </Button>
            )}
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Channels;
