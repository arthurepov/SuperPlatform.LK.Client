import { toast } from 'react-toastify';
import { request } from '../libs';
import { getChildrenFx } from '../components/model';

export const signOutSectionAsync = async (
  setLoading: (loading: boolean) => void,
  childId: string,
  groupId: number,
  onSuccess: (...args: any[]) => void
): Promise<void> => {
  try {
    setLoading(true);
    await request({
      url: `/api/v1/Children/${childId}/sectionGroups/${groupId}`,
      options: {
        method: 'DELETE',
      },
    })();

    getChildrenFx();

    toast.success('Вы отказались от кружка');

    onSuccess();
  } catch ({ message }) {
    console.error(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
};
