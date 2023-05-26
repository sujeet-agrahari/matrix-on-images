const Jimp = require('jimp');

// load the input image
Jimp.read('./input/cover.jpeg', (err, image) => {
  if (err) {
    throw err;
  }

  // get the image width and height
  const w = image.bitmap.width;
  const h = image.bitmap.height;

  // define the rotation matrix for a 90-degree counter-clockwise rotation
  const theta = -Math.PI / 2; // angle in radians
  const cos_theta = Math.cos(theta);
  const sin_theta = Math.sin(theta);
  const rotation_matrix = [
    [cos_theta, -sin_theta],
    [sin_theta, cos_theta],
  ];

  // compute the maximum distance from the center of the input image to its corners
  const max_distance = Math.ceil(
    Math.sqrt(Math.pow(w / 2, 2) + Math.pow(h / 2, 2))
  );

  // compute the dimensions of the padded output image based on the maximum distance
  const w_padded = max_distance * 2;
  const h_padded = max_distance * 2;

  // create a new transparent image with the padded dimensions to hold the rotated pixels
  const rotated = new Jimp(w_padded, h_padded, 0x00000000);

  // apply the rotation transformation to each pixel in the original image
  image.scan(0, 0, w, h, (x, y, idx) => {
    // get the RGBA color values for the current pixel
    const r = image.bitmap.data[idx];
    const g = image.bitmap.data[idx + 1];
    const b = image.bitmap.data[idx + 2];
    const a = image.bitmap.data[idx + 3];

    // calculate the distance of the current pixel from the center of the input image
    const dx = x - w / 2;
    const dy = y - h / 2;
    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    // apply the rotation transformation to the pixel coordinates
    const x_rot = Math.round(
      dx * cos_theta + dy * sin_theta + w_padded / 2 // add padding and re-center
    );
    const y_rot = Math.round(
      -dx * sin_theta + dy * cos_theta + h_padded / 2 // add padding and re-center
    );

    // set the color of the corresponding pixel in the rotated image
    if (x_rot >= 0 && x_rot < w_padded && y_rot >= 0 && y_rot < h_padded) {
      rotated.setPixelColor(Jimp.rgbaToInt(r, g, b, a), x_rot, y_rot);
    }
  });

  // save the rotated image as a new PNG file
  rotated.write('./output/cover.png');
});
