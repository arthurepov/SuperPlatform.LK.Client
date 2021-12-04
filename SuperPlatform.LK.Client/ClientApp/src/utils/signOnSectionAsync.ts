import { toast } from 'react-toastify';
import { request } from '../libs';
import { CHILDREN_URL, getChildrenFx, HOST_URL } from '../components/model';

export const signOnSectionAsync = async (
  childId: string,
  groupId: number,
  setLoading: (loading: boolean) => void,
  setError: (message: string) => void,
  onSuccess: (...args: any[]) => void
): Promise<void> => {
  try {
    setLoading(true);
    await request({
      url: `${HOST_URL}${CHILDREN_URL}/${childId}/sections`,
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sectionGroupId: Number(groupId) }),
      },
    })();

    toast.success('Вы записали ребенка на занятия');

    await getChildrenFx();

    onSuccess();
  } catch ({ message }) {
    console.error(message);

    toast.error(message);

    setError(message);
  } finally {
    setLoading(false);
  }
};
