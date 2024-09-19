/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
          'three/examples/jsm/objects/Water': 'THREE',
          'three/examples/jsm/objects/Sky': 'THREE',
        })
        return config
      },
};

export default nextConfig;
