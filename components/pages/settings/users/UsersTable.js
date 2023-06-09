import { Button, Text, Icon, Icons, ModalTrigger, Modal } from 'react-basics';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import useUser from 'hooks/useUser';
import UserDeleteForm from './UserDeleteForm';
import { ROLES } from 'lib/constants';
import useMessages from 'hooks/useMessages';
import SettingsTable from 'components/common/SettingsTable';

export default function UsersTable({ data = [], onDelete }) {
  const { formatMessage, labels } = useMessages();
  const { user } = useUser();

  const columns = [
    { name: 'username', label: formatMessage(labels.username), style: { flex: 1.5 } },
    { name: 'role', label: formatMessage(labels.role) },
    { name: 'created', label: formatMessage(labels.created) },
    { name: 'action', label: ' ' },
  ];

  const cellRender = (row, data, key) => {
    if (key === 'created') {
      return formatDistance(new Date(row.createdAt), new Date(), {
        addSuffix: true,
      });
    }
    if (key === 'role') {
      return formatMessage(
        labels[Object.keys(ROLES).find(key => ROLES[key] === row.role)] || labels.unknown,
      );
    }
    return data[key];
  };

  return (
    <SettingsTable data={data} columns={columns} cellRender={cellRender}>
      {(row, keys, rowIndex) => {
        return (
          <>
            <Link href={`/settings/users/${row.id}`}>
              <Button>
                <Icon>
                  <Icons.Edit />
                </Icon>
                <Text>{formatMessage(labels.edit)}</Text>
              </Button>
            </Link>
            <ModalTrigger disabled={row.id === user.id}>
              <Button disabled={row.id === user.id}>
                <Icon>
                  <Icons.Trash />
                </Icon>
                <Text>{formatMessage(labels.delete)}</Text>
              </Button>
              <Modal title={formatMessage(labels.deleteUser)}>
                {close => (
                  <UserDeleteForm
                    userId={row.id}
                    username={row.username}
                    onSave={onDelete}
                    onClose={close}
                  />
                )}
              </Modal>
            </ModalTrigger>
          </>
        );
      }}
    </SettingsTable>
  );
}
