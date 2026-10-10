"use client";

export default function PhotoCapture({
  cameraInputRef,
  galleryMultiple = true,
  galleryInputRef,
  onFilesSelected,
}) {
  const handleChange = (event) => {
    if (event.target.files?.length) onFilesSelected(event.target.files);
    event.target.value = "";
  };

  return (
    <>
      <input
        ref={cameraInputRef}
        className="sr-only"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        tabIndex={-1}
      />
      <input
        ref={galleryInputRef}
        className="sr-only"
        type="file"
        accept="image/*"
        multiple={galleryMultiple}
        onChange={handleChange}
        tabIndex={-1}
      />
    </>
  );
}
