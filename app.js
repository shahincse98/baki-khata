/**
 * ডিজিটাল বাকি খাতা - Digital Baki Khata Web Application
 * Core Application Logic & State Management
 */

(function () {
  'use strict';

  // ==========================================================================
  // Sample Seed Data (For first time users)
  // ==========================================================================
  const SAMPLE_STORE = {
    name: 'মেসার্স ভাই ভাই স্টোর'
  };

  const SAMPLE_CUSTOMERS = [
    {
      id: 'cust_101',
      name: 'মো: রহিম আহমেদ',
      phone: '01711223344',
      address: 'দক্ষিণ পাড়া, জামে মসজিদের পাশে',
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      transactions: [
        {
          id: 'tx_1',
          type: 'credit',
          amount: 1500,
          note: 'চিনি ৩ কেজি, সয়াবিন তেল ৫ লিটার',
          date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'tx_2',
          type: 'debit',
          amount: 500,
          note: 'ক্যাশ জমা দিলেন',
          date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'tx_3',
          type: 'credit',
          amount: 250,
          note: 'মুসুর ডাল ১ কেজি ও সাবান',
          date: new Date().toISOString().split('T')[0]
        }
      ]
    },
    {
      id: 'cust_102',
      name: 'করিম শেখ',
      phone: '01822334455',
      address: 'স্কুল রোড, ৩ নং বাড়ি',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      transactions: [
        {
          id: 'tx_4',
          type: 'credit',
          amount: 3200,
          note: 'মিনিকেট চাল ১ বস্তা (২৫ কেজি)',
          date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'tx_5',
          type: 'debit',
          amount: 1200,
          note: 'বিকাশে পেমেন্ট',
          date: new Date().toISOString().split('T')[0]
        }
      ]
    },
    {
      id: 'cust_103',
      name: 'আলমগীর হোসেন',
      phone: '01933445566',
      address: 'পশ্চিম বাজার',
      createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
      transactions: [
        {
          id: 'tx_6',
          type: 'credit',
          amount: 800,
          note: 'আটা ও বিস্কুট',
          date: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'tx_7',
          type: 'debit',
          amount: 800,
          note: 'সম্পূর্ণ বকেয়া পরিশোধ',
          date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0]
        }
      ]
    },
    {
      id: 'cust_104',
      name: 'সুমন মিয়া (চায়ের দোকানদার)',
      phone: '01644556677',
      address: 'বাস স্ট্যান্ডের মোড়',
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      transactions: [
        {
          id: 'tx_8',
          type: 'credit',
          amount: 450,
          note: 'চা পাতা ৫০০ গ্রাম ও কনডেন্সড মিল্ক',
          date: new Date().toISOString().split('T')[0]
        }
      ]
    }
  ];

  // ==========================================================================
  // App State
  // ==========================================================================
  let storeConfig = { name: SAMPLE_STORE.name };
  let customers = [];
  let selectedCustomerId = null;
  let activeFilter = 'all';
  let searchQuery = '';
  let activeSort = 'due-desc';

  // ==========================================================================
  // DOM Elements Cache
  // ==========================================================================
  const storeNameDisplay = document.getElementById('storeNameDisplay');
  const currentDateStr = document.getElementById('currentDateStr');
  const editStoreBtn = document.getElementById('editStoreBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const backupModalBtn = document.getElementById('backupModalBtn');
  const addCustomerTopBtn = document.getElementById('addCustomerTopBtn');

  // Stats Elements
  const totalDueDisplay = document.getElementById('totalDueDisplay');
  const dueCustomerCount = document.getElementById('dueCustomerCount');
  const todayCollectedDisplay = document.getElementById('todayCollectedDisplay');
  const todayCollectedCount = document.getElementById('todayCollectedCount');
  const totalCustomerCount = document.getElementById('totalCustomerCount');
  const totalAdvanceDisplay = document.getElementById('totalAdvanceDisplay');

  // Customer List Elements
  const customerSearchInput = document.getElementById('customerSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterPills = document.getElementById('filterPills');
  const sortSelect = document.getElementById('sortSelect');
  const customerCardsList = document.getElementById('customerCardsList');
  const emptyCustomerState = document.getElementById('emptyCustomerState');

  // Ledger Elements
  const ledgerPlaceholder = document.getElementById('ledgerPlaceholder');
  const ledgerView = document.getElementById('ledgerView');
  const ledgerAvatar = document.getElementById('ledgerAvatar');
  const ledgerName = document.getElementById('ledgerName');
  const ledgerStatusBadge = document.getElementById('ledgerStatusBadge');
  const ledgerContact = document.getElementById('ledgerContact');
  const ledgerBalanceAmount = document.getElementById('ledgerBalanceAmount');
  const openGiveCreditBtn = document.getElementById('openGiveCreditBtn');
  const openGotPaymentBtn = document.getElementById('openGotPaymentBtn');
  const sendWhatsAppReminderBtn = document.getElementById('sendWhatsAppReminderBtn');
  const printLedgerBtn = document.getElementById('printLedgerBtn');
  const deleteCustomerBtn = document.getElementById('deleteCustomerBtn');
  const ledgerTxCount = document.getElementById('ledgerTxCount');
  const txTableBody = document.getElementById('txTableBody');
  const emptyTxState = document.getElementById('emptyTxState');

  // Modals
  const addCustomerModal = document.getElementById('addCustomerModal');
  const addCustomerForm = document.getElementById('addCustomerForm');
  const txModal = document.getElementById('txModal');
  const txForm = document.getElementById('txForm');
  const txModalTitle = document.getElementById('txModalTitle');
  const txTypeInput = document.getElementById('txTypeInput');
  const selectCreditBtn = document.getElementById('selectCreditBtn');
  const selectDebitBtn = document.getElementById('selectDebitBtn');
  const txDate = document.getElementById('txDate');
  const txAmount = document.getElementById('txAmount');
  const txNote = document.getElementById('txNote');
  const storeModal = document.getElementById('storeModal');
  const storeForm = document.getElementById('storeForm');
  const storeNameInput = document.getElementById('storeNameInput');
  const backupModal = document.getElementById('backupModal');
  const downloadBackupBtn = document.getElementById('downloadBackupBtn');
  const restoreFileInput = document.getElementById('restoreFileInput');
  const loadSampleDataBtn = document.getElementById('loadSampleDataBtn');
  const toastContainer = document.getElementById('toastContainer');

  // ==========================================================================
  // Helper & Formatting Functions
  // ==========================================================================
  function toBanglaDigits(num) {
    if (num === null || num === undefined) return '';
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, d => bengaliNumbers[d]);
  }

  function formatCurrency(amount) {
    const formattedNum = Number(amount || 0).toLocaleString('en-IN');
    return `৳ ${formattedNum}`;
  }

  function formatDateBn(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${toBanglaDigits(day)} ${month}, ${toBanglaDigits(year)}`;
    } catch {
      return dateStr;
    }
  }

  function calculateCustomerBalance(customer) {
    if (!customer || !customer.transactions) return 0;
    return customer.transactions.reduce((acc, tx) => {
      const amt = Number(tx.amount) || 0;
      return tx.type === 'credit' ? acc + amt : acc - amt;
    }, 0);
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : '⚠️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================================================
  // Storage Management
  // ==========================================================================
  function loadData() {
    try {
      const storedStore = localStorage.getItem('baki_khata_store');
      if (storedStore) {
        storeConfig = JSON.parse(storedStore);
      } else {
        storeConfig = { name: SAMPLE_STORE.name };
      }

      const storedCust = localStorage.getItem('baki_khata_customers');
      if (storedCust) {
        customers = JSON.parse(storedCust);
      } else {
        // First visit: Load sample realistic data
        customers = SAMPLE_CUSTOMERS;
        saveData();
      }

      const savedTheme = localStorage.getItem('baki_khata_theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } catch (e) {
      console.error('Error loading data:', e);
      customers = SAMPLE_CUSTOMERS;
    }
  }

  function saveData() {
    try {
      localStorage.setItem('baki_khata_store', JSON.stringify(storeConfig));
      localStorage.setItem('baki_khata_customers', JSON.stringify(customers));
    } catch (e) {
      console.error('Error saving data:', e);
      showToast('ডাটা সংরক্ষণে সমস্যা হয়েছে!', 'error');
    }
  }

  // ==========================================================================
  // Render Dashboard Stats
  // ==========================================================================
  function updateDashboardStats() {
    let totalDue = 0;
    let dueCount = 0;
    let totalAdvance = 0;
    let todayCollected = 0;
    let todayTxCount = 0;

    const todayDateStr = new Date().toISOString().split('T')[0];

    customers.forEach(cust => {
      const balance = calculateCustomerBalance(cust);
      if (balance > 0) {
        totalDue += balance;
        dueCount++;
      } else if (balance < 0) {
        totalAdvance += Math.abs(balance);
      }

      if (cust.transactions && Array.isArray(cust.transactions)) {
        cust.transactions.forEach(tx => {
          if (tx.type === 'debit' && tx.date === todayDateStr) {
            todayCollected += Number(tx.amount) || 0;
            todayTxCount++;
          }
        });
      }
    });

    totalDueDisplay.textContent = formatCurrency(totalDue);
    dueCustomerCount.textContent = `${toBanglaDigits(dueCount)} জন কাস্টমার বাকিদার`;

    todayCollectedDisplay.textContent = formatCurrency(todayCollected);
    todayCollectedCount.textContent = `${toBanglaDigits(todayTxCount)} টি জমা লেনদেন`;

    totalCustomerCount.textContent = toBanglaDigits(customers.length);
    totalAdvanceDisplay.textContent = formatCurrency(totalAdvance);
    storeNameDisplay.textContent = storeConfig.name || 'আমার দোকান';
  }

  // ==========================================================================
  // Render Customer Cards List
  // ==========================================================================
  function renderCustomerList() {
    customerCardsList.innerHTML = '';

    // Filter
    let filtered = customers.filter(cust => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        cust.name.toLowerCase().includes(q) ||
        cust.phone.includes(q) ||
        (cust.address && cust.address.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      const balance = calculateCustomerBalance(cust);
      if (activeFilter === 'due') return balance > 0;
      if (activeFilter === 'cleared') return balance === 0;
      if (activeFilter === 'advance') return balance < 0;
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      const balA = calculateCustomerBalance(a);
      const balB = calculateCustomerBalance(b);

      if (activeSort === 'due-desc') {
        return balB - balA;
      } else if (activeSort === 'name-asc') {
        return a.name.localeCompare(b.name, 'bn');
      } else if (activeSort === 'recent') {
        const lastA = a.transactions?.length ? a.transactions[a.transactions.length - 1].date : a.createdAt;
        const lastB = b.transactions?.length ? b.transactions[b.transactions.length - 1].date : b.createdAt;
        return new Date(lastB) - new Date(lastA);
      }
      return 0;
    });

    if (filtered.length === 0) {
      emptyCustomerState.classList.remove('hidden');
    } else {
      emptyCustomerState.classList.add('hidden');
    }

    filtered.forEach(cust => {
      const balance = calculateCustomerBalance(cust);
      const isSelected = cust.id === selectedCustomerId;

      const card = document.createElement('div');
      card.className = `customer-card ${isSelected ? 'active' : ''}`;
      card.dataset.id = cust.id;

      // Initials for avatar
      const initials = cust.name.slice(0, 2);

      let amountClass = 'zero';
      let statusText = 'পরিশোধিত';
      if (balance > 0) {
        amountClass = 'due';
        statusText = 'বাকি পাওনা';
      } else if (balance < 0) {
        amountClass = 'advance';
        statusText = 'অগ্রিম জমা';
      }

      card.innerHTML = `
        <div class="card-left">
          <div class="user-avatar">${initials}</div>
          <div class="card-meta">
            <h4 class="card-name">${cust.name}</h4>
            <div class="card-phone">📞 ${cust.phone}</div>
          </div>
        </div>
        <div class="card-right">
          <div class="card-amount ${amountClass}">${formatCurrency(Math.abs(balance))}</div>
          <span class="card-status-text ${amountClass}">${statusText}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        selectCustomer(cust.id);
      });

      customerCardsList.appendChild(card);
    });
  }

  // ==========================================================================
  // Select Customer & Render Ledger
  // ==========================================================================
  function selectCustomer(customerId) {
    selectedCustomerId = customerId;
    const cust = customers.find(c => c.id === customerId);

    if (!cust) {
      ledgerPlaceholder.classList.remove('hidden');
      ledgerView.classList.add('hidden');
      return;
    }

    ledgerPlaceholder.classList.add('hidden');
    ledgerView.classList.remove('hidden');

    // Highlight selected card
    document.querySelectorAll('.customer-card').forEach(card => {
      card.classList.toggle('active', card.dataset.id === customerId);
    });

    const balance = calculateCustomerBalance(cust);

    // Header info
    ledgerAvatar.textContent = cust.name.slice(0, 2);
    ledgerName.textContent = cust.name;
    ledgerContact.textContent = `📱 ${cust.phone} ${cust.address ? '• 📍 ' + cust.address : ''}`;

    // Badge & Balance styling
    ledgerStatusBadge.className = 'badge';
    ledgerBalanceAmount.className = 'due-box-amount';

    if (balance > 0) {
      ledgerStatusBadge.classList.add('due');
      ledgerStatusBadge.textContent = 'বাকি আছে';
      ledgerBalanceAmount.classList.add('due');
      ledgerBalanceAmount.textContent = formatCurrency(balance);
    } else if (balance < 0) {
      ledgerStatusBadge.classList.add('advance');
      ledgerStatusBadge.textContent = 'অগ্রিম জমা';
      ledgerBalanceAmount.classList.add('advance');
      ledgerBalanceAmount.textContent = formatCurrency(Math.abs(balance));
    } else {
      ledgerStatusBadge.classList.add('cleared');
      ledgerStatusBadge.textContent = 'হিসাব পরিশোধিত';
      ledgerBalanceAmount.classList.add('zero');
      ledgerBalanceAmount.textContent = '৳ 0';
    }

    // Ledger History Table with Running Balance
    txTableBody.innerHTML = '';
    const txList = cust.transactions || [];
    ledgerTxCount.textContent = `${toBanglaDigits(txList.length)} টি লেনদেন`;

    if (txList.length === 0) {
      emptyTxState.classList.remove('hidden');
    } else {
      emptyTxState.classList.add('hidden');

      // Calculate running balance forward
      let currentBal = 0;
      const computedTxs = txList.map(tx => {
        const amt = Number(tx.amount) || 0;
        currentBal = tx.type === 'credit' ? currentBal + amt : currentBal - amt;
        return { ...tx, runningBalance: currentBal };
      });

      // Render descending (most recent first)
      computedTxs.slice().reverse().forEach((tx, reverseIdx) => {
        const originalIndex = txList.length - 1 - reverseIdx;
        const row = document.createElement('tr');

        const creditCell = tx.type === 'credit'
          ? `<span class="amount-due-text">+${formatCurrency(tx.amount)}</span>`
          : '-';

        const debitCell = tx.type === 'debit'
          ? `<span class="amount-paid-text">-${formatCurrency(tx.amount)}</span>`
          : '-';

        row.innerHTML = `
          <td>${formatDateBn(tx.date)}</td>
          <td>${tx.note || (tx.type === 'credit' ? 'পণ্য বাকি' : 'টাকা পরিশোধ')}</td>
          <td class="text-right">${creditCell}</td>
          <td class="text-right">${debitCell}</td>
          <td class="text-right amount-balance-text">${formatCurrency(tx.runningBalance)}</td>
          <td class="text-center">
            <button class="delete-tx-btn" data-index="${originalIndex}" title="এই লেনদেন মুছুন">🗑️</button>
          </td>
        `;

        row.querySelector('.delete-tx-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          deleteTransaction(customerId, originalIndex);
        });

        txTableBody.appendChild(row);
      });
    }
  }

  // ==========================================================================
  // Transaction Actions (Add, Delete)
  // ==========================================================================
  function openTxModal(type = 'credit') {
    if (!selectedCustomerId) {
      showToast('দয়া করে আগে একজন কাস্টমার নির্বাচন করুন!', 'error');
      return;
    }

    txTypeInput.value = type;
    if (type === 'credit') {
      selectCreditBtn.classList.add('active');
      selectDebitBtn.classList.remove('active');
      txModalTitle.textContent = '🔴 বাকি দিলাম (কাস্টমারের খাতে যোগ)';
    } else {
      selectDebitBtn.classList.add('active');
      selectCreditBtn.classList.remove('active');
      txModalTitle.textContent = '🟢 টাকা পেলাম (বকেয়া কর্তন)';
    }

    txAmount.value = '';
    txNote.value = '';
    txDate.value = new Date().toISOString().split('T')[0];

    txModal.classList.remove('hidden');
    setTimeout(() => txAmount.focus(), 50);
  }

  function handleSaveTransaction(e) {
    e.preventDefault();
    const cust = customers.find(c => c.id === selectedCustomerId);
    if (!cust) return;

    const amount = parseFloat(txAmount.value);
    if (!amount || amount <= 0) {
      showToast('সঠিক টাকার পরিমাণ দিন!', 'error');
      return;
    }

    const newTx = {
      id: 'tx_' + Date.now(),
      type: txTypeInput.value,
      amount: amount,
      note: txNote.value.trim(),
      date: txDate.value || new Date().toISOString().split('T')[0]
    };

    if (!cust.transactions) cust.transactions = [];
    cust.transactions.push(newTx);

    saveData();
    updateDashboardStats();
    renderCustomerList();
    selectCustomer(selectedCustomerId);
    closeModal(txModal);

    const msg = newTx.type === 'credit' ? 'বাকি এন্ট্রি সফল হয়েছে!' : 'জমা এন্ট্রি সফল হয়েছে!';
    showToast(msg, 'success');
  }

  function deleteTransaction(customerId, txIndex) {
    const cust = customers.find(c => c.id === customerId);
    if (!cust || !cust.transactions || !cust.transactions[txIndex]) return;

    if (confirm('আপনি কি নিশ্চিত যে এই লেনদেনটি মুছে ফেলতে চান?')) {
      cust.transactions.splice(txIndex, 1);
      saveData();
      updateDashboardStats();
      renderCustomerList();
      selectCustomer(customerId);
      showToast('লেনদেন মুছে ফেলা হয়েছে', 'success');
    }
  }

  // ==========================================================================
  // WhatsApp Reminder Generator
  // ==========================================================================
  function sendWhatsAppReminder() {
    const cust = customers.find(c => c.id === selectedCustomerId);
    if (!cust) return;

    const balance = calculateCustomerBalance(cust);
    if (balance <= 0) {
      showToast('এই কাস্টমারের কোনো বকেয়া বাকি নেই!', 'success');
      return;
    }

    // Clean phone number for WhatsApp BD (880...)
    let phone = cust.phone.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) {
      phone = '88' + phone;
    } else if (!phone.startsWith('880')) {
      phone = '880' + phone;
    }

    const message = `আসসালামু আলাইকুম ${cust.name} ভাই,\n` +
      `${storeConfig.name || 'দোকান'} থেকে বাকি হিসাব সংক্রান্ত বার্তা:\n\n` +
      `আপনার বর্তমান অবশিষ্ট বকেয়া: ৳ ${balance.toLocaleString('en-IN')}\n\n` +
      `অনুগ্রহ করে সুবিধাজনক সময়ে বকেয়া পরিশোধ করার অনুরোধ রইল।\nধন্যবাদ!`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMsg}`;

    window.open(whatsappUrl, '_blank');
    showToast('হোয়াটসঅ্যাপ ওপেন হচ্ছে...', 'success');
  }

  // ==========================================================================
  // Add & Delete Customer
  // ==========================================================================
  function handleAddCustomer(e) {
    e.preventDefault();
    const name = document.getElementById('newCustName').value.trim();
    const phone = document.getElementById('newCustPhone').value.trim();
    const address = document.getElementById('newCustAddress').value.trim();
    const initialDue = parseFloat(document.getElementById('newCustInitialDue').value) || 0;

    if (!name || !phone) {
      showToast('নাম এবং মোবাইল নম্বর দেওয়া আবশ্যক!', 'error');
      return;
    }

    const newCust = {
      id: 'cust_' + Date.now(),
      name: name,
      phone: phone,
      address: address,
      createdAt: new Date().toISOString(),
      transactions: []
    };

    if (initialDue > 0) {
      newCust.transactions.push({
        id: 'tx_' + Date.now(),
        type: 'credit',
        amount: initialDue,
        note: 'পূর্বের বকেয়া হিসাব',
        date: new Date().toISOString().split('T')[0]
      });
    }

    customers.unshift(newCust);
    saveData();
    updateDashboardStats();
    renderCustomerList();
    selectCustomer(newCust.id);
    closeModal(addCustomerModal);
    addCustomerForm.reset();
    showToast(`কাস্টমার "${name}" সফলভাবে যুক্ত হয়েছে!`, 'success');
  }

  function handleDeleteCustomer() {
    const cust = customers.find(c => c.id === selectedCustomerId);
    if (!cust) return;

    if (confirm(`আপনি কি সত্যিই "${cust.name}" এর খাতা সম্পূর্ণ মুছে ফেলতে চান?`)) {
      customers = customers.filter(c => c.id !== selectedCustomerId);
      selectedCustomerId = null;
      saveData();
      updateDashboardStats();
      renderCustomerList();
      ledgerPlaceholder.classList.remove('hidden');
      ledgerView.classList.add('hidden');
      showToast('কাস্টমার খাতা মুছে ফেলা হয়েছে', 'success');
    }
  }

  // ==========================================================================
  // Store Settings & Backup
  // ==========================================================================
  function handleEditStore(e) {
    e.preventDefault();
    const newName = storeNameInput.value.trim();
    if (newName) {
      storeConfig.name = newName;
      saveData();
      updateDashboardStats();
      closeModal(storeModal);
      showToast('দোকানের নাম আপডেট করা হয়েছে!', 'success');
    }
  }

  function downloadBackupJSON() {
    const data = {
      store: storeConfig,
      customers: customers,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baki_khata_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('ব্যাকআপ ফাইল ডাউনলোড হয়েছে!', 'success');
  }

  function handleRestoreJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.customers && Array.isArray(parsed.customers)) {
          customers = parsed.customers;
          if (parsed.store && parsed.store.name) {
            storeConfig.name = parsed.store.name;
          }
          saveData();
          updateDashboardStats();
          renderCustomerList();
          if (customers.length > 0) {
            selectCustomer(customers[0].id);
          }
          closeModal(backupModal);
          showToast('ডাটা সফলভাবে রিস্টোর হয়েছে!', 'success');
        } else {
          showToast('অকার্যকর ব্যাকআপ ফাইল!', 'error');
        }
      } catch (err) {
        showToast('ফাইল পড়তে ব্যর্থ হয়েছে!', 'error');
      }
    };
    reader.readAsText(file);
  }

  function loadSampleData() {
    if (confirm('ডেমো ডাটা লোড করলে বর্তমান ডাটা প্রতিস্থাপিত হবে। চালিয়ে যেতে চান?')) {
      storeConfig = { name: SAMPLE_STORE.name };
      customers = SAMPLE_CUSTOMERS;
      saveData();
      updateDashboardStats();
      renderCustomerList();
      selectCustomer(customers[0].id);
      closeModal(backupModal);
      showToast('ডেমো ডাটা লোড সম্পন্ন হয়েছে!', 'success');
    }
  }

  // ==========================================================================
  // Modal Management
  // ==========================================================================
  function openModal(modalEl) {
    modalEl.classList.remove('hidden');
  }

  function closeModal(modalEl) {
    modalEl.classList.add('hidden');
  }

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      const targetModal = document.getElementById(modalId);
      if (targetModal) closeModal(targetModal);
    });
  });

  // Close modal when clicking outside card
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // ==========================================================================
  // Event Listeners Setup
  // ==========================================================================
  function setupEventListeners() {
    // Theme toggle
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('baki_khata_theme', nextTheme);
    });

    // Top Header Buttons
    editStoreBtn.addEventListener('click', () => {
      storeNameInput.value = storeConfig.name;
      openModal(storeModal);
    });
    storeForm.addEventListener('submit', handleEditStore);

    backupModalBtn.addEventListener('click', () => openModal(backupModal));
    downloadBackupBtn.addEventListener('click', downloadBackupJSON);
    restoreFileInput.addEventListener('change', handleRestoreJSON);
    loadSampleDataBtn.addEventListener('click', loadSampleData);

    addCustomerTopBtn.addEventListener('click', () => {
      addCustomerForm.reset();
      openModal(addCustomerModal);
    });
    addCustomerForm.addEventListener('submit', handleAddCustomer);

    // Search & Filter
    customerSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      clearSearchBtn.classList.toggle('hidden', !searchQuery);
      renderCustomerList();
    });

    clearSearchBtn.addEventListener('click', () => {
      customerSearchInput.value = '';
      searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      renderCustomerList();
    });

    filterPills.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-pill')) {
        document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        activeFilter = e.target.dataset.filter;
        renderCustomerList();
      }
    });

    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      renderCustomerList();
    });

    // Ledger Action Buttons
    openGiveCreditBtn.addEventListener('click', () => openTxModal('credit'));
    openGotPaymentBtn.addEventListener('click', () => openTxModal('debit'));

    selectCreditBtn.addEventListener('click', () => {
      txTypeInput.value = 'credit';
      selectCreditBtn.classList.add('active');
      selectDebitBtn.classList.remove('active');
    });

    selectDebitBtn.addEventListener('click', () => {
      txTypeInput.value = 'debit';
      selectDebitBtn.classList.add('active');
      selectCreditBtn.classList.remove('active');
    });

    txForm.addEventListener('submit', handleSaveTransaction);
    sendWhatsAppReminderBtn.addEventListener('click', sendWhatsAppReminder);
    printLedgerBtn.addEventListener('click', () => window.print());
    deleteCustomerBtn.addEventListener('click', handleDeleteCustomer);
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================
  function init() {
    loadData();
    setupEventListeners();
    updateDashboardStats();
    renderCustomerList();

    // Auto-select first customer for rich preview
    if (customers.length > 0) {
      selectCustomer(customers[0].id);
    }

    // Set today's date in header
    const today = new Date();
    currentDateStr.textContent = `${formatDateBn(today.toISOString().split('T')[0])} • ডিজিটাল খাতা v1.0`;
  }

  // Run on page load
  document.addEventListener('DOMContentLoaded', init);
})();
