import expressLoader from './express';

export default async ({ expressApp }) => {
  expressLoader({ app: expressApp });
  console.log("🔥🔥 Express loaded 🔥🔥");
};
