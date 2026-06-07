const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (packageJson.devbuild) {
  // Увеличиваем число и сохраняем обратно как строку
  packageJson.devbuild = String(Number(packageJson.devbuild) + 1);

  // Записываем обновленный объект обратно в файл с сохранением форматирования (2 пробела)
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  // console.log(`devbuild успешно увеличен до: ${packageJson.devbuild}`);
} else {
  // console.error('Поле devbuild не найдено в package.json');
}
