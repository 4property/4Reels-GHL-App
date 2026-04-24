import { useNavigate, useParams } from 'react-router-dom';
import { ReelEditor } from './editor/ReelEditor.jsx';

/** Reads the reel id from `/reels/:id` and navigates back to `/reels` on close. */
export function ReelEditorRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <ReelEditor reelId={id} onClose={() => navigate('/reels')} />;
}
