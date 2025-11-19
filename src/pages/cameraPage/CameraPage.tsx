import useFetchCameras from "../../hooks/useFetchCameras";
const CameraPage = () => {
  const { data, isLoading } = useFetchCameras();
  console.log(data, isLoading);
  return <div>CameraPage</div>;
};

export default CameraPage;
