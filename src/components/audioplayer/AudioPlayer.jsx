function AudioPlayer(props) {
  return (
    <audio id={props.id} loop={props.loop}>
      <source src={props.audioTrackSrc} type="audio/mpeg" />
    </audio>
  );
}

export default AudioPlayer;