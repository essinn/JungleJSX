import { writeFile, mkdir } from "fs/promises";
import { join, resolve } from "path";

export async function createJungleApp(projectName?: string) {
  if (!projectName) {
    throw new Error("Project name is required.");
  }

  const projectPath = resolve(process.cwd(), projectName);
  await mkdir(join(projectPath, "api"), { recursive: true });
  await mkdir(join(projectPath, "src"), { recursive: true });

  const pkgJson = {
    name: projectName,
    version: "0.1.0",
    main: "src/app.tsx",
    scripts: {
      dev: "tsc --watch",
      start: "node dist/app.js",
    },
    dependencies: {
      "jungle-jsx": "^1.0.0",
    },
    devDependencies: {
      typescript: "^5.0.0",
    },
  };

  await writeFile(
    join(projectPath, "package.json"),
    JSON.stringify(pkgJson, null, 2)
  );

  const indexContent = `import { GET, Response } from "jungle-jsx";
export default function RootRoute() {
  return <GET>{() => <Response status={200}>{{ message: "Welcome!" }}</Response>}</GET>;
}
`;
  const usersContent = `import { GET, POST, Response } from "jungle-jsx";
import { AuthMarker, RateLimitMarker } from "jungle-jsx";

export default function UsersRoute() {
  return (
    <AuthMarker>
      <RateLimitMarker limit={5}>
        <GET>{({ params }) => <Response>{{ userId: params.id }}</Response>}</GET>
        <POST>{({ body }) => <Response status={201}>{{ createdUser: body }}</Response>}</POST>
      </RateLimitMarker>
    </AuthMarker>
  );
}
`;

  await writeFile(join(projectPath, "api/index.tsx"), indexContent);
  await writeFile(join(projectPath, "api/users/[id].tsx"), usersContent);

  const appContent = `import { App } from "jungle-jsx";
export default function MyApp() { return <App port={5000} />; }
`;
  await writeFile(join(projectPath, "src/app.tsx"), appContent);

  console.log(`✅ Project "${projectName}" created!`);
  console.log(`Run: cd ${projectName} && npm install && npm start`);
}
