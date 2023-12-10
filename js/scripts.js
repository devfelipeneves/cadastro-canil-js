document.addEventListener('DOMContentLoaded', () => {
  
  if (document.getElementById('selectRacas')) {
    criarOpcoesSelect();
  }

  if (document.getElementById('racasList')) {
    atualizarListaRacas();
  }

  const caesTable = document.getElementById('caesTable');
  const caesList = document.getElementById('caesList');
  if (caesTable && caesList) {
    atualizarTabelaCaes();
  }
});

function atualizarListaRacas() {
  let racas = JSON.parse(localStorage.getItem('racas')) || [];
  const racasList = document.getElementById('racasList');
  const racasHeader = document.getElementById('racasHeader');

  racasList.innerHTML = '';

  if (racas.length == 0) {
    racasHeader.textContent = 'Nenhuma raça cadastrada.'
  } else {
    racasHeader.textContent = 'Raças Cadastradas'
  }

  racas.forEach(raca => {
    const li = document.createElement('li');
    li.textContent = raca;
    racasList.appendChild(li);
  });
}

function atualizarTabelaCaes() {
  let caes = JSON.parse(localStorage.getItem('caes')) || [];
  const caesTable = document.getElementById('caesTable');
  const caesList = document.getElementById('caesList');
  const caesHeader = document.getElementById('caesHeader');

  caesTable.style.display = caes.length > 0 ? 'table' : 'none';
  caesList.innerHTML = '';

  if (caes.length == 0) {
    caesHeader.textContent = 'Nenhum cão cadastrado.'
  } else {
    caesHeader.textContent = 'Cães Cadastrados'
  }

  caes.forEach(cao => {
    const row = caesList.insertRow();
    row.insertCell(0).textContent = cao.nome;
    row.insertCell(1).textContent = cao.raca;
  });
}

function criarOpcoesSelect() {
  let racas = JSON.parse(localStorage.getItem('racas')) || [];
  const selectRacas = document.getElementById('selectRacas');

  selectRacas.innerHTML = '';

  racas.forEach(raca => {
    const option = document.createElement('option');
    option.value = raca;
    option.textContent = raca;
    selectRacas.appendChild(option);
  });
}

function cadastrarRaca() {
  let racas = JSON.parse(localStorage.getItem('racas')) || [];
  const racaNome = document.getElementById('racaNome').value;
  let racaJaCadastrado = false;

  if (!racaNome || racaNome == '') {
    exibirModalAlerta('Digite uma raça para cadastrar.', false);
    return;
  }

  for (let i = 0; i < racas.length; i++) {
    const raca = racas[i];
    if (racaNome == raca) {
      exibirModalAlerta('Raça já cadastrada.');
      racaJaCadastrado = true;
      break;
    }
  }

  if (!racaJaCadastrado) {
    racas.push(racaNome);
    salvarDadosLocalmente('racas', racas);
    exibirModalAlerta(`Raça >>${racaNome}<< cadastrada com sucesso!`);
    document.getElementById('racasForm').reset();
    atualizarListaRacas();
  }
}

function cadastrarCao() {
  let caes = JSON.parse(localStorage.getItem('caes')) || [];
  const caesNome = document.getElementById('caesNome').value;
  const racaSelecionada = document.getElementById('selectRacas').value;
  let caoJaCadastrado = false;

  if (!racaSelecionada) {
    exibirModalAlerta('Selecione uma raça antes de cadastrar o cão.');
    return;
  }

  if (!caesNome || caesNome == '') {
    exibirModalAlerta('Digite um nome para cadastrar.');
    return;
  }

  for (let i = 0; i < caes.length; i++) {
    const cao = caes[i];
    if (caesNome == cao.nome && racaSelecionada == cao.raca) {
      exibirModalAlerta('Cão já cadastrado.');
      caoJaCadastrado = true;
      break;
    }
  }

  if (!caoJaCadastrado) {
    caes.push({ nome: caesNome, raca: racaSelecionada });
    salvarDadosLocalmente('caes', caes);
    exibirModalAlerta(`Cão >>${caesNome}<< cadastrado com sucesso na raça >>${racaSelecionada}<<!`);
    document.getElementById('caesForm').reset();
    atualizarTabelaCaes();
  }
}

function salvarDadosLocalmente(tipo, item) {
  localStorage.setItem(tipo, JSON.stringify(item));
}

function resetarLocalStorage(item) {
  let caes = JSON.parse(localStorage.getItem('caes')) || [];
  let racas = JSON.parse(localStorage.getItem('racas')) || [];

  switch (item) {
    case 'racas' : {

      let caesException = []
    
      for (let i = 0; i < racas.length; i++) {
        const raca = racas[i];
    
        for (let j = 0; j < caes.length; j++) {
          const cao = caes[j];
          if (raca == cao.raca) {
            caesException.push(`O cão ${cao.nome} está cadastrado na raça ${cao.raca}!\n`);
          }
        }
      }
    
      if (caesException.length == 0) {
        localStorage.removeItem(item);
        atualizarListaRacas();
      } else {
        caesException = caesException.join("");
        caesException.replace(",", "");
        exibirModalAlerta(caesException, false);
      }
      break;
    }
    
    case 'caes': {
      localStorage.removeItem(item);
      atualizarTabelaCaes();
      break;
    }
     default: localStorage.clear();
  }
}

function resetarDados(item) {
  exibirModalConfirmacao('Tem certeza que deseja resetar os dados? Esta ação não pode ser desfeita.', 'Dados resetados com sucesso!', ()=>resetarLocalStorage(item))
}

function verificarRacasECadastrarCao(event) {
  const racas = JSON.parse(localStorage.getItem('racas')) || [];

  if (racas.length === 0) {
    exibirModalAlerta('Você deve cadastrar pelo menos uma raça antes de cadastrar um cão.', false);
    event.preventDefault();
    event.stopPropagation();
    setTimeout(() => {
      window.location.href = '/pages/cadastro-racas.html';
    }, 2000)
  } else {
    window.location.href = '/pages/cadastro-caes.html';
  }
}

function exibirModalConfirmacao(pergunta, resposta, funcao) {
  const modal = document.getElementById('myModal');
  const modalHeader = document.getElementById('modal-header');
  const modalMessage = document.getElementById('modal-message');
  const confirmarBotao = document.createElement('button');
  const cancelarBotao = document.createElement('button');
  const div = document.createElement('div');
  const br = document.createElement('br');

  modal.style.display = 'flex';
  
  modalHeader.style.fontWeight = "bold";
  modalMessage.textContent = pergunta;
  modalHeader.textContent = 'Atenção!';

  confirmarBotao.textContent = 'Confirmar';
  confirmarBotao.onclick = function () {
    modalMessage.textContent = resposta;
    funcao();
    setTimeout(fecharModal, 2000);
  };

  cancelarBotao.textContent = 'Cancelar';
  cancelarBotao.className = 'button button-cancel';
  cancelarBotao.onclick = function () {
    fecharModal();
  };

  div.appendChild(br);
  div.appendChild(confirmarBotao);
  div.appendChild(cancelarBotao);

  modalMessage.appendChild(div);
}

function exibirModalAlerta(mensagem, exibirBotao = true) {
  const modal = document.getElementById('myModal');
  const modalHeader = document.getElementById('modal-header');
  const modalMessage = document.getElementById('modal-message');
  const confirmarBotao = document.createElement('button');
  const div = document.createElement('div');
  const br = document.createElement('br');

  if (!exibirBotao) {
    confirmarBotao.style.display = "none";
  }

  modal.style.display = 'flex';
  modalHeader.style.fontWeight = "bold";
  modalMessage.textContent = mensagem;
  modalHeader.textContent = 'Atenção!';

  confirmarBotao.textContent = 'Confirmar';
  confirmarBotao.onclick = function () {
    fecharModal();
  };

  div.appendChild(br);
  div.appendChild(confirmarBotao);
  modalMessage.appendChild(div);

  if (!exibirBotao) {
    setTimeout(fecharModal, 2000);
  }
}

function fecharModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
}
