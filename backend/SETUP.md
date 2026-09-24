# Backend: configuracao e execucao local

Requisitos: JDK 21 e um PostgreSQL previamente preparado para este backend.
Execute os comandos abaixo no PowerShell, dentro da pasta `backend/`.

## Variaveis obrigatorias

| Variavel | Uso |
| --- | --- |
| `DB_URL` | URL JDBC completa: `jdbc:postgresql://HOST:PORTA/NOME_DO_BANCO`. Nao inclua credenciais na URL. |
| `DB_USER` | Usuario do PostgreSQL. |
| `DB_PASSWORD` | Senha do PostgreSQL. |
| `JWT_SECRET` | Chave em Base64 que, decodificada, tenha pelo menos 32 bytes. |

`src/main/resources/application.properties` mapeia `DB_URL`, `DB_USER` e `DB_PASSWORD` para o datasource do Spring Boot. `JwtConfig.java` le `JWT_SECRET` diretamente do ambiente.

**O Spring Boot nao carrega `.env.example` nem `.env` automaticamente neste projeto.** O exemplo apenas documenta os nomes: copiar ou renomear o arquivo nao configura o processo. Configure as variaveis no terminal que executara o Maven, na configuracao de execucao da IDE ou no gerenciador de segredos do ambiente. Nao preencha arquivos do repositorio com valores reais.

## Compilar sem acessar o banco

```powershell
.\mvnw.cmd -DskipTests test-compile
```

Esse comando compila a aplicacao e os testes, mas nao executa os testes nem inicia o Spring. Nao exige as variaveis de execucao. O teste `contextLoads` inicia o contexto Spring; nao use `test` ou `verify` para uma verificacao sem acesso ao banco.

## Configurar a sessao e executar

Defina os valores por entrada interativa, sem escreve-los em comandos ou arquivos:

```powershell
$env:DB_URL = Read-Host 'URL JDBC do PostgreSQL'
$env:DB_USER = Read-Host 'Usuario do PostgreSQL'

$dbPasswordInput = Read-Host 'Senha do PostgreSQL' -AsSecureString
$env:DB_PASSWORD = [System.Net.NetworkCredential]::new('', $dbPasswordInput).Password
$dbPasswordInput.Dispose()
Remove-Variable dbPasswordInput

$jwtSecretInput = Read-Host 'JWT_SECRET em Base64' -AsSecureString
$env:JWT_SECRET = [System.Net.NetworkCredential]::new('', $jwtSecretInput).Password
$jwtSecretInput.Dispose()
Remove-Variable jwtSecretInput

.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--spring.jpa.hibernate.ddl-auto=none --spring.sql.init.mode=never"
```

Use uma chave JWT fornecida pelo gerenciador de segredos ou gerada com um gerador criptograficamente seguro. Nao use o texto de um exemplo como chave. Nao imprima as variaveis que contem segredos.

A execucao acima acessa o PostgreSQL e depende das tabelas ja existentes. Os argumentos desativam a alteracao automatica de esquema pelo Hibernate e a inicializacao por scripts SQL; nao impedem gravacoes feitas pelas funcionalidades quando utilizadas. A porta HTTP padrao e 8080, salvo configuracao externa.

Encerre com Ctrl+C. Para retirar as credenciais desta sessao:

```powershell
Remove-Item Env:DB_PASSWORD, Env:JWT_SECRET -ErrorAction SilentlyContinue
```

A compilacao nao comprova conectividade, credenciais, compatibilidade das tabelas nem inicializacao completa. Essas verificacoes exigem uma validacao de execucao separada e autorizada.
